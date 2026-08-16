vendetta => ({
    onLoad() {
        console.log("CloudCord Cosmetics v2 loaded");
    },

    onUnload() {
        console.log("CloudCord Cosmetics v2 unloaded");
    },

    settings: () => {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;

        const cosmetics = [
            ["none", "○", "None", "Disable preview"],
            ["stars", "✦", "Starry Frame", "Star-style local preview"],
            ["sparkles", "✧", "Sparkle Effect", "Sparkle-style local preview"],
            ["crown", "♛", "Crown Frame", "Crown-style local preview"],
            ["aurora", "◈", "Aurora Effect", "Aurora-style local preview"]
        ];

        const [selected, setSelected] = React.useState("none");

        const selectedItem =
            cosmetics.find(item => item[0] === selected) ||
            cosmetics[0];

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
                        fontSize: 25,
                        fontWeight: "800",
                        marginBottom: 5
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
                "Client-side cosmetic previews"
            ),

            React.createElement(
                RN.View,
                {
                    style: {
                        padding: 16,
                        borderRadius: 14,
                        marginBottom: 20,
                        backgroundColor: "#2b2d31"
                    }
                },

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontSize: 18,
                            fontWeight: "800"
                        }
                    },
                    "Selected"
                ),

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#b5bac1",
                            fontSize: 15,
                            marginTop: 8
                        }
                    },
                    selectedItem[1] + "  " + selectedItem[2]
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
                "Frames & Effects"
            ),

            ...cosmetics.map(item =>
                React.createElement(
                    RN.Pressable,
                    {
                        key: item[0],
                        onPress: () => setSelected(item[0]),

                        style: {
                            padding: 15,
                            marginBottom: 9,
                            borderRadius: 12,

                            backgroundColor:
                                selected === item[0]
                                    ? "#5865f2"
                                    : "#1e1f22"
                        }
                    },

                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#ffffff",
                                fontSize: 16,
                                fontWeight: "700"
                            }
                        },
                        (selected === item[0] ? "✓ " : "") +
                            item[1] +
                            "  " +
                            item[2]
                    ),

                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#b5bac1",
                                marginTop: 4,
                                fontSize: 12
                            }
                        },
                        item[3]
                    )
                )
            ),

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#72767d",
                        fontSize: 12,
                        marginTop: 12,
                        lineHeight: 18
                    }
                },
                "Preview selections are local to the client and do not grant Discord account entitlements."
            )
        );
    }
})
