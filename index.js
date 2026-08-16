({
    onLoad() {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;
        const storage = vendetta.plugin.storage;

        this._unpatch = null;

        try {
            const Avatar = vendetta.metro.findByProps(
                "default",
                "AvatarSizes",
                "getStatusSize"
            );

            if (!Avatar || typeof Avatar.default !== "function") {
                console.log("[CC] Avatar module not found");
                return;
            }

            this._unpatch = vendetta.patcher.after(
                "default",
                Avatar,
                (args, result) => {
                    const frame = storage.frame || "none";
                    const effect = storage.effect || "none";

                    if (!result || (frame === "none" && effect === "none")) {
                        return result;
                    }

                    const frameInfo = {
                        stars: { color: "#f5c542", symbol: "✦" },
                        crown: { color: "#f59e0b", symbol: "♛" },
                        crystal: { color: "#67e8f9", symbol: "◇" }
                    }[frame];

                    const effectInfo = {
                        sparkles: { symbol: "✧", color: "#ffffff" },
                        aurora: { symbol: "◈", color: "#7dd3fc" },
                        snow: { symbol: "❄", color: "#ffffff" }
                    }[effect];

                    const color =
                        frameInfo?.color ||
                        effectInfo?.color ||
                        "#5865f2";

                    return React.createElement(
                        RN.View,
                        {
                            style: {
                                position: "relative",
                                alignSelf: "center",
                                borderRadius: 999,
                                borderWidth: frameInfo ? 3 : 0,
                                borderColor: color,
                                padding: frameInfo ? 2 : 0
                            }
                        },
                        result,

                        effectInfo &&
                            React.createElement(
                                RN.Text,
                                {
                                    style: {
                                        position: "absolute",
                                        right: -6,
                                        top: -9,
                                        color: effectInfo.color,
                                        fontSize: 13,
                                        fontWeight: "900"
                                    }
                                },
                                effectInfo.symbol
                            ),

                        frameInfo &&
                            React.createElement(
                                RN.Text,
                                {
                                    style: {
                                        position: "absolute",
                                        left: -6,
                                        bottom: -9,
                                        color: frameInfo.color,
                                        fontSize: 12,
                                        fontWeight: "900"
                                    }
                                },
                                frameInfo.symbol
                            )
                    );
                }
            );

            console.log("[CC] avatar patch installed");
        } catch (e) {
            console.log("[CC] avatar patch failed: " + String(e));
        }
    },

    onUnload() {
        try {
            if (this._unpatch) {
                this._unpatch();
                this._unpatch = null;
            }
        } catch (e) {
            console.log("[CC] avatar unpatch failed: " + String(e));
        }

        console.log("[CC] unloaded");
    },

    settings: function Settings() {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;
        const storage = vendetta.plugin.storage;

        const [frame, setFrame] = React.useState(
            storage.frame || "none"
        );

        const [effect, setEffect] = React.useState(
            storage.effect || "none"
        );

        React.useEffect(() => {
            storage.frame = frame;
            storage.effect = effect;
        }, [frame, effect]);

        const button = (id, name, current, setter) =>
            React.createElement(
                RN.Pressable,
                {
                    key: id,
                    onPress: () => setter(id),
                    style: {
                        padding: 14,
                        borderRadius: 12,
                        marginBottom: 8,
                        backgroundColor:
                            current === id
                                ? "#5865f2"
                                : "#1e1f22"
                    }
                },
                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontSize: 15,
                            fontWeight: "700"
                        }
                    },
                    (current === id ? "✓ " : "") + name
                )
            );

        return React.createElement(
            RN.ScrollView,
            {
                style: { flex: 1 },
                contentContainerStyle: {
                    padding: 16,
                    paddingBottom: 40
                }
            },

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#ffffff",
                        fontSize: 24,
                        fontWeight: "800",
                        marginBottom: 8
                    }
                },
                "CloudCord Cosmetics"
            ),

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#b5bac1",
                        fontSize: 14,
                        marginBottom: 20
                    }
                },
                "Local avatar frames and effects"
            ),

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "800",
                        marginBottom: 10
                    }
                },
                "Avatar Frames"
            ),

            button("none", "None", frame, setFrame),
            button("stars", "✦ Starry Frame", frame, setFrame),
            button("crown", "♛ Crown Frame", frame, setFrame),
            button("crystal", "◇ Crystal Frame", frame, setFrame),

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "800",
                        marginTop: 12,
                        marginBottom: 10
                    }
                },
                "Profile Effects"
            ),

            button("none", "None", effect, setEffect),
            button("sparkles", "✧ Sparkles", effect, setEffect),
            button("aurora", "◈ Aurora", effect, setEffect),
            button("snow", "❄ Snow", effect, setEffect)
        );
    }
})
