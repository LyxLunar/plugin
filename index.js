({
    onLoad() {
        console.log("CloudCord Cosmetics settings test loaded");
    },

    onUnload() {
        console.log("CloudCord Cosmetics settings test unloaded");
    },

    settings: function Settings() {
        const React = vendetta.common.React;
        const RN = vendetta.common.ReactNative;

        return React.createElement(
            RN.View,
            { style: { flex: 1, padding: 20 } },
            React.createElement(
                RN.Text,
                { style: { fontSize: 24, fontWeight: "800" } },
                "CloudCord Cosmetics"
            ),
            React.createElement(
                RN.Text,
                { style: { marginTop: 12, fontSize: 16 } },
                "Settings are working!"
            )
        );
    }
})