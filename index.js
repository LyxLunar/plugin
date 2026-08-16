({
    onLoad() {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;
        const storage = vendetta.plugin.storage;

        this.React = React;
        this.RN = RN;
        this.storage = storage;
        this.unpatch = null;

        const Avatar = vendetta.metro.findByProps(
            "default",
            "AvatarSizes",
            "getStatusSize"
        );

        if (!Avatar || typeof Avatar.default !== "function") {
            console.log("[CloudCord Cosmetics] Avatar renderer not found");
            return;
        }

        this.unpatch = vendetta.patcher.after(
            "default",
            Avatar,
            (args, result) => {
                const frame = storage.frame || "none";
                const effect = storage.effect || "none";

                if (!result || (frame === "none" && effect === "none")) {
                    return result;
                }

                const frameData = {
                    stars: {
                        borderWidth: 3,
                        borderColor: "#f5c542",
                        symbol: "✦"
                    },
                    crown: {
                        borderWidth: 3,
                        borderColor: "#f59e0b",
                        symbol: "♛"
                    },
                    crystal: {
                        borderWidth: 3,
                        borderColor: "#67e8f9",
                        symbol: "◇"
                    }
                }[frame];

                const effectData = {
                    sparkles: { symbol: "✧" },
                    aurora: { symbol: "◈" },
                    snow: { symbol: "❄" }
                }[effect];

                const border = frameData || {
                    borderWidth: 2,
                    borderColor: "#5865f2",
                    symbol: ""
                };

                return React.createElement(
                    RN.View,
                    {
                        style: {
                            position: "relative",
                            alignSelf: "center",
                            borderRadius: 999,
                            borderWidth: border.borderWidth,
                            borderColor: border.borderColor,
                            padding: 2
                        }
                    },

                    result,

                    (frameData || effectData) &&
                        React.createElement(
                            RN.Text,
                            {
                                style: {
                                    position: "absolute",
                                    right: -5,
                                    top: -8,
                                    color: border.borderColor,
                                    fontSize: 13,
                                    fontWeight: "900"
                                }
                            },
                            frameData?.symbol ||
                                effectData?.symbol ||
                                ""
                        ),

                    effectData &&
                        React.createElement(
                            RN.Text,
                            {
                                style: {
                                    position: "absolute",
                                    left: -5,
                                    bottom: -8,
                                    color: "#ffffff",
                                    fontSize: 11,
                                    fontWeight: "900"
                                }
                            },
                            effectData.symbol
                        )
                );
            }
        );

        console.log("[CloudCord Cosmetics] avatar renderer patched");
    },

    onUnload() {
        if (this.unpatch) {
            this.unpatch();
            this.unpatch = null;
        }

        console.log("[CloudCord Cosmetics] unloaded");
    },

    settings: (() => {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;
        const storage = vendetta.plugin.storage;

        return function CosmeticsSettings() {
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
                button("snow", "❄ Snow", effect, setEffect),

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#777",
                            fontSize: 12,
                            marginTop: 16
                        }
                    },
                    "Selections apply locally to rendered avatars."
                )
            );
        };
    })()
})
