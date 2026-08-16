({
    onLoad() {
        console.log("[CloudCord Cosmetics] loaded");
    },

    onUnload() {
        console.log("[CloudCord Cosmetics] unloaded");
    },

    settings: (() => {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;

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
                    RN.Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontSize: 18,
                            fontWeight: "800"
                        }
                    },
                    "Avatar Frames"
                ),

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#b5bac1",
                            marginTop: 8
                        }
                    },
                    "Settings screen is working."
                )
            );
        };
    })()
})
