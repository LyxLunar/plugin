/*
 * CloudCord Cosmetics v4
 *
 * Built for the Vendetta-style CloudCord mobile plugin runtime.
 *
 * IMPORTANT:
 * This plugin is presentation-only. It does not modify Discord inventory,
 * Nitro status, purchases, account entitlements, or server-side profile data.
 */

vendetta => {
    const React = vendetta.metro.common.React ?? globalThis.React;
    const RN = vendetta.metro.common.ReactNative;

    if (!React || !RN) {
        throw new Error("CloudCord Cosmetics: React/ReactNative unavailable");
    }

    const { View, Text, ScrollView, Pressable, TextInput } = RN;
    const storage = vendetta.plugin.storage;
    const patches = [];

    const DEFAULTS = {
        enabled: true,
        renderOthers: true,
        decoration: "stars",
        effect: "glow",
        nameplate: "neon",
        frame: "aurora",
        displayNameStyle: "bold",
        syncEnabled: false,
        syncUrl: "",
    };

    const OPTIONS = {
        decoration: [
            ["none", "None", "No avatar decoration"],
            ["stars", "Stars", "Star accent"],
            ["sparkles", "Sparkles", "Sparkle accent"],
            ["crown", "Crown", "Crown accent"],
            ["hearts", "Hearts", "Heart accent"],
        ],
        effect: [
            ["none", "None", "No profile effect"],
            ["glow", "Glow", "Soft glow"],
            ["pulse", "Pulse", "Pulse accent"],
            ["shimmer", "Shimmer", "Shimmer accent"],
            ["confetti", "Confetti", "Confetti accent"],
        ],
        nameplate: [
            ["none", "None", "No nameplate"],
            ["neon", "Neon", "Neon nameplate"],
            ["aurora", "Aurora", "Aurora nameplate"],
            ["pixel", "Pixel", "Pixel nameplate"],
        ],
        frame: [
            ["none", "None", "No profile frame"],
            ["classic", "Classic", "Classic frame"],
            ["rounded", "Rounded", "Rounded frame"],
            ["ornate", "Ornate", "Ornate frame"],
            ["aurora", "Aurora", "Aurora frame"],
        ],
        displayNameStyle: [
            ["default", "Default", "Normal display name"],
            ["bold", "Bold", "Bold display name"],
            ["italic", "Italic", "Italic display name"],
            ["mono", "Mono", "Monospace display name"],
        ],
    };

    const isValid = (category, id) =>
        OPTIONS[category].some(x => x[0] === id);

    const loadState = () => {
        const s = storage || {};
        const next = { ...DEFAULTS, ...s };

        for (const category of ["decoration", "effect", "nameplate", "frame", "displayNameStyle"]) {
            if (!isValid(category, next[category]))
                next[category] = DEFAULTS[category];
        }

        if (typeof next.syncUrl !== "string")
            next.syncUrl = "";

        next.syncUrl = next.syncUrl.slice(0, 500);
        next.enabled = next.enabled !== false;
        next.renderOthers = next.renderOthers !== false;
        next.syncEnabled = next.syncEnabled === true;

        return next;
    };

    let state = loadState();
    let socket = null;
    let reconnectTimer = null;

    const save = () => {
        try {
            Object.assign(storage, state);
        } catch (e) {
            vendetta.logger?.error?.("Failed to save cosmetics settings", e);
        }
    };

    const update = (change) => {
        state = { ...state, ...change };
        save();
        if (state.syncEnabled)
            publish();
    };

    const labelFor = (category, id) =>
        OPTIONS[category].find(x => x[0] === id)?.[1] ?? id;

    const symbolFor = (category, id) => ({
        decoration: { stars: "✦", sparkles: "✧", crown: "♛", hearts: "♥" },
        effect: { glow: "◌", pulse: "◉", shimmer: "✧", confetti: "✺" },
        nameplate: { neon: "N", aurora: "A", pixel: "P" },
        frame: { classic: "◇", rounded: "○", ornate: "✥", aurora: "◈" },
    }[category]?.[id] ?? "");

    const Badge = ({ category, id }) => {
        if (!id || id === "none" || (category === "displayNameStyle" && id === "default"))
            return null;

        return React.createElement(View, {
            style: {
                marginLeft: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: "rgba(88,101,242,0.18)",
                borderWidth: 1,
                borderColor: "rgba(88,101,242,0.55)",
            },
        },
            React.createElement(Text, {
                style: { color: "#d9ddff", fontSize: 10, fontWeight: "700" },
            }, `${symbolFor(category, id)} ${labelFor(category, id)}`)
        );
    };

    const CosmeticOverlay = ({ user, local }) => {
        if (!state.enabled || !user)
            return null;

        if (!local && !state.renderOthers)
            return null;

        const username = user.global_name || user.username || "";
        const nameStyle = {
            fontWeight: state.displayNameStyle === "bold" ? "800" : "600",
            fontStyle: state.displayNameStyle === "italic" ? "italic" : "normal",
            fontFamily: state.displayNameStyle === "mono" ? "monospace" : undefined,
        };

        return React.createElement(View, {
            pointerEvents: "none",
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
                marginTop: 3,
                borderWidth: state.frame === "none" ? 0 : 1,
                borderColor: state.frame === "aurora"
                    ? "rgba(130,220,255,0.75)"
                    : "rgba(88,101,242,0.55)",
                borderRadius: state.frame === "rounded" || state.frame === "aurora" ? 14 : 7,
                backgroundColor: state.effect === "glow"
                    ? "rgba(88,101,242,0.10)"
                    : "transparent",
            },
        },
            React.createElement(Text, { style: { color: "#fff", ...nameStyle } }, username),
            React.createElement(Badge, { category: "decoration", id: state.decoration }),
            React.createElement(Badge, { category: "effect", id: state.effect }),
            React.createElement(Badge, { category: "nameplate", id: state.nameplate }),
            React.createElement(Badge, { category: "frame", id: state.frame })
        );
    };

    /*
     * Try to locate a profile component without assuming one exact Discord
     * build. If no candidate is found, the plugin remains usable and settings
     * still work.
     */
    const profileNames = [
        "UserProfile",
        "UserProfileModal",
        "UserProfileScreen",
        "UserProfileOverview",
        "Profile",
    ];

    const getUser = (node, seen = new Set(), depth = 0) => {
        if (!node || depth > 8 || typeof node !== "object" || seen.has(node))
            return null;

        seen.add(node);

        const p = node.props;
        const candidate = p?.user || p?.userData || p?.profile?.user;

        if (candidate && typeof candidate.id === "string")
            return candidate;

        if (Array.isArray(node)) {
            for (const child of node) {
                const found = getUser(child, seen, depth + 1);
                if (found) return found;
            }
        }

        if (p?.children) {
            const found = getUser(p.children, seen, depth + 1);
            if (found) return found;
        }

        return null;
    };

    const wrapResult = (result, user) => {
        if (!result || !user || !React.isValidElement(result))
            return result;

        const overlay = React.createElement(CosmeticOverlay, {
            user,
            local: true,
        });

        return React.createElement(View, {
            style: { position: "relative", flex: 1 },
        }, result, overlay);
    };

    const patchProfileComponent = (component) => {
        if (!component)
            return;

        try {
            if (component.prototype?.render) {
                const unpatch = vendetta.patcher.after(
                    "render",
                    component.prototype,
                    (args, result) => wrapResult(result, getUser(result) || args?.[0]?.user)
                );
                patches.push(unpatch);
                return;
            }

            /*
             * Functional components are often exposed as the function itself.
             * Patching the function's call is not safe with every JS engine, so
             * we intentionally leave those untouched instead of risking crashes.
             */
        } catch (e) {
            vendetta.logger?.warn?.("Profile patch skipped", e);
        }
    };

    const findProfiles = () => {
        for (const name of profileNames) {
            try {
                const components = vendetta.metro.findByNameAll(name, false) || [];
                for (const component of components.slice(0, 3))
                    patchProfileComponent(component);
            } catch {}
        }
    };

    const send = message => {
        try {
            if (socket?.readyState === 1)
                socket.send(JSON.stringify(message));
        } catch {}
    };

    const publish = () => {
        if (!state.syncEnabled || !state.syncUrl)
            return;

        send({
            type: "cloudcord-cosmetics",
            version: 1,
            state: {
                decoration: state.decoration,
                effect: state.effect,
                nameplate: state.nameplate,
                frame: state.frame,
                displayNameStyle: state.displayNameStyle,
            },
        });
    };

    const disconnect = () => {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
        try { socket?.close(); } catch {}
        socket = null;
    };

    const connect = () => {
        disconnect();

        if (!state.syncEnabled || !/^wss?:\/\//i.test(state.syncUrl))
            return;

        try {
            socket = new WebSocket(state.syncUrl);

            socket.onopen = publish;

            socket.onmessage = event => {
                try {
                    const msg = JSON.parse(String(event.data));
                    if (msg?.type !== "cloudcord-cosmetics" || msg?.version !== 1)
                        return;

                    const incoming = msg.state || {};
                    const patch = {};

                    for (const category of ["decoration", "effect", "nameplate", "frame", "displayNameStyle"]) {
                        if (isValid(category, incoming[category]))
                            patch[category] = incoming[category];
                    }

                    if (Object.keys(patch).length)
                        update(patch);
                } catch {}
            };

            socket.onclose = () => {
                if (state.syncEnabled)
                    reconnectTimer = setTimeout(connect, 5000);
            };
        } catch {
            reconnectTimer = setTimeout(connect, 5000);
        }
    };

    const Option = ({ category, item }) => {
        const [id, title, description] = item;
        const selected = state[category] === id;

        return React.createElement(Pressable, {
            onPress: () => update({ [category]: id }),
            style: {
                padding: 12,
                marginBottom: 7,
                borderRadius: 11,
                backgroundColor: selected
                    ? "rgba(88,101,242,0.30)"
                    : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: selected
                    ? "rgba(120,130,255,0.90)"
                    : "rgba(255,255,255,0.08)",
            },
        },
            React.createElement(Text, {
                style: { color: "#fff", fontSize: 15, fontWeight: selected ? "800" : "600" },
            }, selected ? `✓ ${title}` : title),
            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 12, marginTop: 3 },
            }, description)
        );
    };

    const Category = ({ category, title }) =>
        React.createElement(View, { style: { marginBottom: 18 } },
            React.createElement(Text, {
                style: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
            }, title),
            ...OPTIONS[category].map(item =>
                React.createElement(Option, {
                    key: `${category}:${item[0]}`,
                    category,
                    item,
                })
            )
        );

    const Settings = () => {
        const [, rerender] = React.useReducer(x => x + 1, 0);

        const change = patch => {
            update(patch);
            rerender();
        };

        return React.createElement(ScrollView, {
            style: { flex: 1, backgroundColor: "#111214" },
            contentContainerStyle: { padding: 16, paddingBottom: 60 },
        },
            React.createElement(Text, {
                style: { color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 5 },
            }, "CloudCord Cosmetics"),
            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 13, marginBottom: 20 },
            }, "Local cosmetic preview. Discord account inventory is unchanged."),

            React.createElement(Category, { category: "decoration", title: "Avatar Decorations" }),
            React.createElement(Category, { category: "effect", title: "Profile Effects" }),
            React.createElement(Category, { category: "nameplate", title: "Nameplates" }),
            React.createElement(Category, { category: "frame", title: "Profile Frames" }),
            React.createElement(Category, { category: "displayNameStyle", title: "Display Name Styles" }),

            React.createElement(Text, {
                style: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
            }, "Rendering"),

            React.createElement(Pressable, {
                onPress: () => change({ enabled: !state.enabled }),
                style: {
                    padding: 14,
                    borderRadius: 11,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    marginBottom: 8,
                },
            }, React.createElement(Text, {
                style: { color: "#fff", fontWeight: "700" },
            }, `${state.enabled ? "✓" : "○"} Enable cosmetics`)),

            React.createElement(Pressable, {
                onPress: () => change({ renderOthers: !state.renderOthers }),
                style: {
                    padding: 14,
                    borderRadius: 11,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    marginBottom: 8,
                },
            }, React.createElement(Text, {
                style: { color: "#fff", fontWeight: "700" },
            }, `${state.renderOthers ? "✓" : "○"} Render compatible remote cosmetics`)),

            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 12, marginTop: 4 },
            }, "The included cosmetics are local CloudCord styles, not Discord Shop assets."),

            React.createElement(Text, {
                style: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 20, marginBottom: 8 },
            }, "CloudCord Sync"),

            React.createElement(Pressable, {
                onPress: () => {
                    const enabled = !state.syncEnabled;
                    change({ syncEnabled: enabled });
                    if (enabled) connect();
                    else disconnect();
                },
                style: {
                    padding: 14,
                    borderRadius: 11,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    marginBottom: 8,
                },
            }, React.createElement(Text, {
                style: { color: "#fff", fontWeight: "700" },
            }, `${state.syncEnabled ? "✓" : "○"} Enable compatible-client sync`)),

            React.createElement(TextInput, {
                value: state.syncUrl,
                onChangeText: value => change({ syncUrl: value.slice(0, 500) }),
                placeholder: "wss://your-relay.example",
                placeholderTextColor: "#72767d",
                autoCapitalize: "none",
                autoCorrect: false,
                style: {
                    color: "#fff",
                    backgroundColor: "#1e1f22",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 11,
                    marginBottom: 10,
                },
            }),

            React.createElement(Pressable, {
                onPress: connect,
                style: {
                    padding: 14,
                    borderRadius: 11,
                    backgroundColor: "#5865f2",
                    alignItems: "center",
                },
            }, React.createElement(Text, {
                style: { color: "#fff", fontWeight: "800" },
            }, "Reconnect Sync"))
        );
    };

    /*
     * Vendetta's mobile plugin manager expects the lowercase `settings`
     * property to contain the actual React element. This is different from
     * desktop Vencord's `Settings` convention and fixes the non-working wrench.
     */
    return {
        SettingsComponent: Settings,

        onLoad() {
            findProfiles();
            if (state.syncEnabled)
                connect();
        },

        onUnload() {
            for (const unpatch of patches.splice(0)) {
                try { unpatch?.(); } catch {}
            }
            disconnect();
        },
    };
};
