vendetta => ({
    onLoad() {
        try {
            const Avatar = vendetta.metro.common.Avatar;

            vendetta.logger.info(
                "[Cosmetics] Avatar module found: " +
                Object.keys(Avatar || {}).join(", ")
            );

            if (Avatar && Avatar.default) {
                vendetta.logger.info(
                    "[Cosmetics] Avatar.default found: " +
                    (Avatar.default.name || "anonymous")
                );
            }
        } catch (e) {
            vendetta.logger.error(
                "[Cosmetics] Avatar probe failed: " +
                String(e)
            );
        }
    },

    onUnload() {
        vendetta.logger.info("[Cosmetics] Avatar probe unloaded");
    },

    settings: () => null
})
