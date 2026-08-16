const plugin = {
    SettingsComponent() {
        const React = bunny.api.react.React;
        const ReactNative = bunny.api.react.ReactNative;

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
    },

    start() {
        bunny.plugin.logger.info("CloudCord Cosmetics loaded");
    },

    stop() {
        bunny.plugin.logger.info("CloudCord Cosmetics unloaded");
    }
};
