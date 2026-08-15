# CloudCord Cosmetics — Working v1

This build is based on CloudCord's actual Vendetta plugin loader.

Important:
- The plugin source is an object expression, not a `vendetta => ...` factory.
- It uses the `vendetta` variable supplied by CloudCord's evaluator.
- Settings are exposed through the lowercase `settings` property expected by
  CloudCord's Vendetta plugin manager.
- The selected preview is persisted in the plugin's storage.
- No network sync or account-entitlement spoofing is included.

The cosmetic choices in this baseline are presentation-only placeholders.
Profile rendering will be added only after this settings/storage baseline is
confirmed working on the user's CloudCord build.
