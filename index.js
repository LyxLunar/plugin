/*
 * CloudCord Cosmetics — Android/Vendetta-compatible plugin
 *
 * Presentation-only cosmetics:
 * - Avatar decorations
 * - Profile effects
 * - Nameplates
 * - Profile frames
 * - Display-name styles
 *
 * It never edits Discord inventory/entitlements or sends Discord auth data.
 *
 * This plugin is deliberately defensive because Discord's React Native
 * component names can change between builds.
 */

module.exports = (vendetta) => {
    const { React, ReactNative } = vendetta.metro.common;
    const { findByName } = vendetta.metro.filters;
    const { after } = vendetta.patcher;
    const { General } = vendetta.ui.components;
    const { storage } = vendetta.plugin;

    const RN = ReactNative;
    const { View, Text, Pressable, ScrollView } = RN;

    const DEFAULTS = {
        enabled: true,
        decoration: "stars",
        effect: "glow",
        nameplate: "neon",
        frame: "aurora",
        displayNameStyle: "bold",
        renderOthers: true,
        syncEnabled: false,
        syncUrl: "",
    };

    const COSMETICS = {
        decoration: [
            ["none", "None", "No decoration"],
            ["stars", "Stars", "Star accent"],
            ["sparkles", "Sparkles", "Sparkle accent"],
            ["crown", "Crown", "Crown accent"],
            ["hearts", "Hearts", "Heart accent"],
        ],
        effect: [
            ["none", "None", "No effect"],
            ["glow", "Glow", "Soft glow"],
            ["pulse", "Pulse", "Pulse animation"],
            ["shimmer", "Shimmer", "Shimmer accent"],
            ["confetti", "Confetti", "Confetti accent"],
        ],
        nameplate: [
            ["none", "None", "No nameplate"],
            ["neon", "Neon", "Neon-style nameplate"],
            ["aurora", "Aurora", "Aurora-style nameplate"],
            ["pixel", "Pixel", "Pixel-style nameplate"],
        ],
        frame: [
            ["none", "None", "No frame"],
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

    const cleanId = (value, fallback) => {
        if (typeof value !== "string") return fallback;
        const result = value.trim().replace(/[^a-zA-Z0-9_.:-]/g, "").slice(0, 80);
        return result || fallback;
    };

    const validValue = (category, value) =>
        COSMETICS[category].some(([id]) => id === value) ? value : DEFAULTS[category];

    const load = () => {
        const saved = storage?.data && typeof storage.data === "object" ? storage.data : {};
        return {
            ...DEFAULTS,
            ...saved,
            decoration: validValue("decoration", cleanId(saved.decoration, DEFAULTS.decoration)),
            effect: validValue("effect", cleanId(saved.effect, DEFAULTS.effect)),
            nameplate: validValue("nameplate", cleanId(saved.nameplate, DEFAULTS.nameplate)),
            frame: validValue("frame", cleanId(saved.frame, DEFAULTS.frame)),
            displayNameStyle: validValue("displayNameStyle", cleanId(saved.displayNameStyle, DEFAULTS.displayNameStyle)),
            enabled: saved.enabled !== false,
            renderOthers: saved.renderOthers !== false,
            syncEnabled: saved.syncEnabled === true,
            syncUrl: typeof saved.syncUrl === "string" ? saved.syncUrl.slice(0, 500) : "",
        };
    };

    let state = load();
    const unpatches = [];
    let socket = null;
    let socketTimer = null;

    const save = () => {
        try {
            if (storage?.set)
                storage.set(state);
            else if (storage)
                storage.data = { ...state };
        } catch (e) {
            console.error("[CloudCordCosmetics] Failed to save settings", e);
        }
    };

    const setState = (patch) => {
        state = { ...state, ...patch };
        save();
        if (state.syncEnabled) publish();
    };

    const cosmeticText = (category, id) => {
        const row = COSMETICS[category]?.find(x => x[0] === id);
        return row ? row[1] : id;
    };

    /*
     * The visual layer uses React Native primitives instead of Discord's
     * proprietary Shop artwork. This makes the plugin self-contained and
     * avoids depending on fragile CDN asset URLs.
     */
    const CosmeticBadge = ({ label, type }) => {
        const symbols = {
            decoration: { stars: "✦", sparkles: "✧", crown: "♛", hearts: "♥" },
            effect: { glow: "◌", pulse: "◉", shimmer: "✧", confetti: "✺" },
            nameplate: { neon: "N", aurora: "A", pixel: "P" },
            frame: { classic: "◇", rounded: "○", ornate: "✥", aurora: "◈" },
        };

        return React.createElement(View, {
            style: {
                marginLeft: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: "rgba(88,101,242,0.18)",
                borderWidth: 1,
                borderColor: "rgba(88,101,242,0.55)",
            }
        }, React.createElement(Text, {
            style: { color: "#d9ddff", fontSize: 10, fontWeight: "700" }
        }, `${symbols[type]?.[state[type]] ?? ""} ${label}`));
    };

    const CosmeticOverlay = ({ user }) => {
        if (!state.enabled || !user) return null;
        if (!state.renderOthers && !user.isMe) return null;

        const username = user.global_name || user.username || "";
        const nameStyle = {
            fontWeight: state.displayNameStyle === "bold" ? "800" : "600",
            fontStyle: state.displayNameStyle === "italic" ? "italic" : "normal",
            fontFamily: state.displayNameStyle === "mono" ? "monospace" : undefined,
        };

        return React.createElement(View, {
            pointerEvents: "none",
            style: {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: 8,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 4,
                backgroundColor: state.effect === "glow"
                    ? "rgba(88,101,242,0.10)"
                    : "transparent",
                borderWidth: state.frame === "none" ? 0 : 1,
                borderColor: state.frame === "aurora"
                    ? "rgba(130,220,255,0.75)"
                    : "rgba(88,101,242,0.55)",
                borderRadius: state.frame === "rounded" || state.frame === "aurora" ? 16 : 8,
            }
        },
            React.createElement(Text, {
                style: {
                    color: "#ffffff",
                    ...nameStyle,
                }
            }, username),
            state.decoration !== "none"
                ? React.createElement(CosmeticBadge, {
                    label: cosmeticText("decoration", state.decoration),
                    type: "decoration"
                })
                : null,
            state.effect !== "none"
                ? React.createElement(CosmeticBadge, {
                    label: cosmeticText("effect", state.effect),
                    type: "effect"
                })
                : null,
            state.nameplate !== "none"
                ? React.createElement(CosmeticBadge, {
                    label: cosmeticText("nameplate", state.nameplate),
                    type: "nameplate"
                })
                : null,
            state.frame !== "none"
                ? React.createElement(CosmeticBadge, {
                    label: cosmeticText("frame", state.frame),
                    type: "frame"
                })
                : null
        );
    };

    /*
     * Defensive profile patch:
     * Try several common mobile profile component names. If none exist, the
     * plugin still loads and its Settings page remains usable.
     */
    const PROFILE_NAMES = [
        "UserProfile",
        "UserProfileModal",
        "UserProfileScreen",
        "Profile",
        "UserProfileOverview",
    ];

    const getUserFromTree = (tree) => {
        let found = null;
        const seen = new Set();

        const walk = (node, depth = 0) => {
            if (!node || depth > 10 || found) return;
            if (typeof node !== "object") return;
            if (seen.has(node)) return;
            seen.add(node);

            const props = node.props;
            const candidate = props?.user || props?.userData || props?.profile?.user;
            if (candidate && typeof candidate === "object" && typeof candidate.id === "string") {
                found = candidate;
                return;
            }

            for (const key of Object.keys(node)) {
                if (key === "children" || key === "props") {
                    walk(node[key], depth + 1);
                }
            }

            if (Array.isArray(node)) {
                for (const child of node)
                    walk(child, depth + 1);
            }
        };

        walk(tree);
        return found;
    };

    const patchProfile = (target) => {
        if (!target || typeof target.render !== "function") return;
        try {
            unpatches.push(after("render", target, (_args, ret) => {
                try {
                    const user = getUserFromTree(ret);
                    if (!user || !ret) return ret;

                    const overlay = React.createElement(CosmeticOverlay, {
                        user: {
                            ...user,
                            isMe: true,
                        }
                    });

                    if (ret?.props?.children) {
                        const children = Array.isArray(ret.props.children)
                            ? [...ret.props.children, overlay]
                            : [ret.props.children, overlay];

                        return React.cloneElement(ret, {
                            ...ret.props,
                            children,
                        });
                    }

                    return React.createElement(View, {
                        style: { position: "relative", flex: 1 }
                    }, ret, overlay);
                } catch (e) {
                    console.error("[CloudCordCosmetics] Profile render patch failed", e);
                    return ret;
                }
            }));
        } catch (e) {
            console.warn("[CloudCordCosmetics] Could not patch profile renderer", e);
        }
    };

    const patchProfiles = () => {
        for (const name of PROFILE_NAMES) {
            try {
                patchProfile(findByName(name, false));
            } catch {}
        }
    };

    const send = (message) => {
        try {
            if (socket?.readyState === 1)
                socket.send(JSON.stringify(message));
        } catch {}
    };

    const publish = () => {
        if (!state.syncEnabled || !state.syncUrl) return;
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

    const connect = () => {
        if (!state.syncEnabled || !/^wss?:\/\//i.test(state.syncUrl)) return;
        try {
            socket?.close();
            socket = new WebSocket(state.syncUrl);

            socket.onopen = () => {
                publish();
            };

            socket.onmessage = (event) => {
                try {
                    const msg = JSON.parse(String(event.data));
                    if (msg?.type !== "cloudcord-cosmetics" || msg.version !== 1) return;
                    const incoming = msg.state || {};
                    state = {
                        ...state,
                        decoration: validValue("decoration", incoming.decoration),
                        effect: validValue("effect", incoming.effect),
                        nameplate: validValue("nameplate", incoming.nameplate),
                        frame: validValue("frame", incoming.frame),
                        displayNameStyle: validValue("displayNameStyle", incoming.displayNameStyle),
                    };
                    save();
                } catch {}
            };

            socket.onerror = () => {};
            socket.onclose = () => {
                if (state.syncEnabled) {
                    clearTimeout(socketTimer);
                    socketTimer = setTimeout(connect, 5000);
                }
            };
        } catch {}
    };

    const disconnect = () => {
        clearTimeout(socketTimer);
        socketTimer = null;
        try { socket?.close(); } catch {}
        socket = null;
    };

    const Choice = ({ category, item }) => {
        const [id, label, description] = item;
        const selected = state[category] === id;

        return React.createElement(Pressable, {
            onPress: () => setState({ [category]: id }),
            style: {
                padding: 12,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: selected ? "rgba(88,101,242,0.28)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: selected ? "rgba(120,130,255,0.85)" : "rgba(255,255,255,0.08)",
            }
        },
            React.createElement(Text, {
                style: { color: "#fff", fontSize: 15, fontWeight: selected ? "800" : "600" }
            }, selected ? `✓ ${label}` : label),
            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 12, marginTop: 3 }
            }, description)
        );
    };

    const Section = ({ category, title }) => React.createElement(View, {
        style: { marginBottom: 18 }
    },
        React.createElement(Text, {
            style: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 }
        }, title),
        ...COSMETICS[category].map(item =>
            React.createElement(Choice, {
                key: item[0],
                category,
                item,
            })
        )
    );

    const Settings = () => {
        const [, force] = React.useState(0);

        const update = (patch) => {
            setState(patch);
            force(x => x + 1);
        };

        return React.createElement(ScrollView, {
            style: { flex: 1, backgroundColor: "#111214" },
            contentContainerStyle: { padding: 16, paddingBottom: 80 }
        },
            React.createElement(Text, {
                style: { color: "#fff", fontSize: 25, fontWeight: "900", marginBottom: 4 }
            }, "CloudCord Cosmetics"),
            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 13, marginBottom: 20 }
            }, "Local presentation-only profile cosmetics."),
            React.createElement(Section, { category: "decoration", title: "Avatar Decorations" }),
            React.createElement(Section, { category: "effect", title: "Profile Effects" }),
            React.createElement(Section, { category: "nameplate", title: "Nameplates" }),
            React.createElement(Section, { category: "frame", title: "Profile Frames" }),
            React.createElement(Section, { category: "displayNameStyle", title: "Display Name Styles" }),

            React.createElement(Text, {
                style: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 }
            }, "Behavior"),

            React.createElement(Pressable, {
                onPress: () => update({ enabled: !state.enabled }),
                style: { padding: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 8 }
            }, React.createElement(Text, { style: { color: "#fff", fontWeight: "700" } },
                `${state.enabled ? "✓" : "○"} Enable cosmetic rendering`
            )),

            React.createElement(Pressable, {
                onPress: () => update({ renderOthers: !state.renderOthers }),
                style: { padding: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 8 }
            }, React.createElement(Text, { style: { color: "#fff", fontWeight: "700" } },
                `${state.renderOthers ? "✓" : "○"} Render cosmetics for compatible profiles`
            )),

            React.createElement(Text, {
                style: { color: "#a9adb8", fontSize: 12, marginTop: 4 }
            }, "The built-in renderer uses local symbols/styles. Discord Shop artwork is not copied into the plugin."),

            React.createElement(Text, {
                style: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 20, marginBottom: 8 }
            }, "CloudCord Sync"),

            React.createElement(Pressable, {
                onPress: () => update({ syncEnabled: !state.syncEnabled }),
                style: { padding: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 8 }
            }, React.createElement(Text, { style: { color: "#fff", fontWeight: "700" } },
                `${state.syncEnabled ? "✓" : "○"} Enable compatible-client sync`
            )),

            React.createElement(RN.TextInput, {
                value: state.syncUrl,
                onChangeText: value => update({ syncUrl: value.slice(0, 500) }),
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
                }
            }),

            React.createElement(Pressable, {
                onPress: () => {
                    disconnect();
                    if (state.syncEnabled) connect();
                },
                style: {
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: "#5865f2",
                    alignItems: "center",
                }
            }, React.createElement(Text, {
                style: { color: "#fff", fontWeight: "800" }
            }, "Reconnect Sync"))
        );
    };

    return {
        onLoad() {
            patchProfiles();
            if (state.syncEnabled) connect();
        },

        onUnload() {
            for (const unpatch of unpatches.splice(0))
                try { unpatch?.(); } catch {}
            disconnect();
        },

        Settings,
    };
};
