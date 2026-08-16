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
                    "Cosmetic preview controls"
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

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#b5bac1",
                            fontSize: 14,
                            marginBottom: 18
                        }
                    },
                    "Renderer integration comes next. This screen confirms the mobile React API works."
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
                    "Profile Effects"
                ),

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#b5bac1",
                            fontSize: 14
                        }
                    },
                    "Ready for the Android avatar renderer patch."
                )
            );
        };
    })()
})
