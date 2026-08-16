({
    onLoad() {
        console.log("[CloudCord Cosmetics] loaded");
    },

    onUnload() {
        console.log("[CloudCord Cosmetics] unloaded");
    },

    settings: (() => {
        const React = vendetta.metro.common.React;
        const RN = vendetta.metro.common.ReactNative;

        return function CosmeticsSettings() {
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
                    "Android client-side cosmetic preview"
                ),

                React.createElement(
                    RN.View,
                    {
                        style: {
                            backgroundColor: "#2b2d31",
                            borderRadius: 14,
                            padding: 16,
                            marginBottom: 18
                        }
                    },
                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#ffffff",
                                fontSize: 18,
                                fontWeight: "800",
                                marginBottom: 8
                            }
                        },
                        "Renderer status"
                    ),
                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#b5bac1",
                                fontSize: 14,
                                lineHeight: 20
                            }
                        },
                        "Mobile React API loaded successfully."
                    )
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

                ...[
                    "None",
                    "Starry Frame",
                    "Crown Frame",
                    "Crystal Frame"
                ].map((name, index) =>
                    React.createElement(
                        RN.Pressable,
                        {
                            key: name,
                            onPress: () =>
                                console.log("[CC] frame:", name),
                            style: {
                                padding: 14,
                                borderRadius: 12,
                                marginBottom: 8,
                                backgroundColor:
                                    index === 0
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
                            name
                        )
                    )
                ),

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

                ...[
                    "None",
                    "Sparkles",
                    "Aurora",
                    "Snow"
                ].map(name =>
                    React.createElement(
                        RN.Pressable,
                        {
                            key: name,
                            onPress: () =>
                                console.log("[CC] effect:", name),
                            style: {
                                padding: 14,
                                borderRadius: 12,
                                marginBottom: 8,
                                backgroundColor: "#1e1f22"
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
                            name
                        )
                    )
                )
            );
        };
    })()
})
