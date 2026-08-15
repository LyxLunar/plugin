({
    settings: function Settings() {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;
        const storage = vendetta.plugin.storage;

        const useState = React.useState;
        const useEffect = React.useEffect;

        const cosmetics = [
            { id: "none", title: "None", subtitle: "No preview cosmetic", symbol: "○" },
            { id: "stars", title: "Starry Frame", subtitle: "Local preview", symbol: "✦" },
            { id: "sparkles", title: "Sparkle Effect", subtitle: "Local preview", symbol: "✧" },
            { id: "crown", title: "Crown Frame", subtitle: "Local preview", symbol: "♛" },
            { id: "aurora", title: "Aurora Effect", subtitle: "Local preview", symbol: "◈" }
        ];

        return function CosmeticsSettings() {
            const [selected, setSelected] = useState(storage.selected || "none");

            useEffect(() => {
                storage.selected = selected;
            }, [selected]);

            const selectedCosmetic =
                cosmetics.find(c => c.id === selected) || cosmetics[0];

            return React.createElement(
                RN.ScrollView,
                {
                    style: { flex: 1 },
                    contentContainerStyle: {
                        padding: 16,
                        paddingBottom: 80
                    }
                },

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontSize: 24,
                            fontWeight: "800",
                            marginBottom: 6
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
                            marginBottom: 18
                        }
                    },
                    "Working v1 — local cosmetic preview. This does not grant Discord account entitlements."
                ),

                React.createElement(
                    RN.View,
                    {
                        style: {
                            borderRadius: 16,
                            padding: 18,
                            marginBottom: 20,
                            backgroundColor: "#1e1f22",
                            borderWidth: 1,
                            borderColor: "#5865f2"
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
                        selectedCosmetic.symbol + "  " + selectedCosmetic.title
                    ),
                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#b5bac1",
                                marginTop: 6
                            }
                        },
                        "Selected cosmetic: " + selectedCosmetic.id
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
                    "Choose a preview"
                ),

                ...cosmetics.map(c =>
                    React.createElement(
                        RN.Pressable,
                        {
                            key: c.id,
                            onPress: () => setSelected(c.id),
                            style: {
                                padding: 15,
                                borderRadius: 12,
                                marginBottom: 8,
                                backgroundColor:
                                    selected === c.id
                                        ? "rgba(88,101,242,0.30)"
                                        : "#1e1f22",
                                borderWidth: 1,
                                borderColor:
                                    selected === c.id
                                        ? "#5865f2"
                                        : "#2b2d31"
                            }
                        },
                        React.createElement(
                            RN.Text,
                            {
                                style: {
                                    color: "#ffffff",
                                    fontSize: 16,
                                    fontWeight: selected === c.id ? "800" : "600"
                                }
                            },
                            (selected === c.id ? "✓ " : "") +
                            c.symbol + "  " + c.title
                        ),
                        React.createElement(
                            RN.Text,
                            {
                                style: {
                                    color: "#b5bac1",
                                    fontSize: 12,
                                    marginTop: 4
                                }
                            },
                            c.subtitle
                        )
                    )
                )
            );
        };
    },

    onLoad() {
        vendetta.logger.info("CloudCord Cosmetics v1 loaded");
    },

    onUnload() {
        vendetta.logger.info("CloudCord Cosmetics v1 unloaded");
    }
})