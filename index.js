vendetta => ({
    onLoad() {
        vendetta.logger.info("CloudCord Cosmetics settings test loaded");
    },

    onUnload() {
        vendetta.logger.info("CloudCord Cosmetics settings test unloaded");
    },

    settings: function Settings() {
        const React = vendetta.common.React;
        const ReactNative = vendetta.common.ReactNative;

        return React.createElement(
            ReactNative.View,
            {
                style: {
                    flex: 1,
                    padding: 20
                }
            },

            React.createElement(
                ReactNative.Text,
                {
                    style: {
                        fontSize: 24,
                        fontWeight: "800"
                    }
                },
                "CloudCord Cosmetics"
            ),

            React.createElement(
                ReactNative.Text,
                {
                    style: {
                        marginTop: 12,
                        fontSize: 16
                    }
                },
                "Settings are working!"
            )
        );
    }
})
