vendetta => {
    const React = vendetta.metro.common.React;
    const RN = vendetta.metro.common.ReactNative;

    const { View, Text, Pressable, ScrollView } = RN;

    function Settings() {
        const [enabled, setEnabled] = React.useState(true);
        const [selected, setSelected] = React.useState("Stars");

        const options = ["Stars", "Sparkles", "Crown", "Aurora"];

        return React.createElement(
            ScrollView,
            {
                style: { flex: 1, backgroundColor: "#111214" },
                contentContainerStyle: { padding: 16, paddingBottom: 80 }
            },
            React.createElement(
                Text,
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
                Text,
                {
                    style: {
                        color: "#b5bac1",
                        fontSize: 14,
                        marginBottom: 20
                    }
                },
                "Final settings test — if you can see this screen, the CloudCord plugin settings hook works."
            ),

            React.createElement(
                Pressable,
                {
                    onPress: () => setEnabled(v => !v),
                    style: {
                        padding: 15,
                        borderRadius: 12,
                        backgroundColor: enabled
                            ? "rgba(88,101,242,0.28)"
                            : "rgba(255,255,255,0.06)",
                        marginBottom: 14
                    }
                },
                React.createElement(
                    Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontSize: 16,
                            fontWeight: "700"
                        }
                    },
                    (enabled ? "✓ " : "○ ") + "Cosmetics enabled"
                )
            ),

            React.createElement(
                Text,
                {
                    style: {
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "800",
                        marginBottom: 10
                    }
                },
                "Decoration test"
            ),

            ...options.map(option =>
                React.createElement(
                    Pressable,
                    {
                        key: option,
                        onPress: () => setSelected(option),
                        style: {
                            padding: 13,
                            borderRadius: 10,
                            backgroundColor:
                                selected === option
                                    ? "rgba(88,101,242,0.28)"
                                    : "rgba(255,255,255,0.06)",
                            marginBottom: 7
                        }
                    },
                    React.createElement(
                        Text,
                        {
                            style: {
                                color: "#ffffff",
                                fontSize: 15,
                                fontWeight: selected === option ? "800" : "500"
                            }
                        },
                        (selected === option ? "✓ " : "") + option
                    )
                )
            ),

            React.createElement(
                View,
                {
                    style: {
                        marginTop: 18,
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: "rgba(87,242,135,0.10)",
                        borderWidth: 1,
                        borderColor: "rgba(87,242,135,0.35)"
                    }
                },
                React.createElement(
                    Text,
                    {
                        style: { color: "#ffffff", fontWeight: "700" }
                    },
                    "Selected: " + selected
                ),
                React.createElement(
                    Text,
                    {
                        style: {
                            color: "#b5bac1",
                            marginTop: 5,
                            fontSize: 12
                        }
                    },
                    "This build intentionally contains no profile patching or networking. It isolates the settings system."
                )
            )
        );
    }

    /*
     * CloudCord's Android Vendetta manager reads:
     *   VdPluginManager.getSettings(id) -> pluginInstance[id]?.settings
     *
     * Therefore the returned plugin object must expose a COMPONENT FUNCTION
     * through the lowercase `settings` property.
     */
    return {
        settings: Settings,

        onLoad() {
            // Intentionally empty for this diagnostic build.
        },

        onUnload() {
            // Intentionally empty for this diagnostic build.
        }
    };
}
