vendetta => ({
    onLoad() {
        vendetta.logger.info("CloudCord Cosmetics Android loaded");

        try {
            const modules = vendetta.metro.common;
            vendetta.logger.info(
                "CloudCord Cosmetics: Metro API available"
            );
        } catch (e) {
            vendetta.logger.error(
                "CloudCord Cosmetics: Metro API unavailable"
            );
        }
    },

    onUnload() {
        vendetta.logger.info("CloudCord Cosmetics Android unloaded");
    },

    settings: () => {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;

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
                        fontWeight: "800"
                    }
                },
                "CloudCord Cosmetics"
            ),

            React.createElement(
                RN.Text,
                {
                    style: {
                        color: "#b5bac1",
                        marginTop: 10,
                        lineHeight: 20
                    }
                },
                "Android renderer test"
            ),

            React.createElement(
                RN.View,
                {
                    style: {
                        marginTop: 20,
                        padding: 16,
                        borderRadius: 12,
                        backgroundColor: "#1e1f22"
                    }
                },

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#ffffff",
                            fontWeight: "700"
                        }
                    },
                    "Renderer status"
                ),

                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#b5bac1",
                            marginTop: 8
                        }
                    },
                    "The next step is identifying CloudCord Android's avatar-decoration renderer."
                )
            )
        );
    }
})
