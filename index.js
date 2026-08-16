const plugin = {
    SettingsComponent() {
        return null;
    },

    start() {
        bunny.plugin.logger.info("CloudCord Cosmetics settings test loaded");
    },

    stop() {
        bunny.plugin.logger.info("CloudCord Cosmetics settings test unloaded");
    }
};
