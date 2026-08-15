# CloudCord Cosmetics — Minimal Enable Test

This is intentionally a no-op plugin.

It has:
- no React Native imports
- no Metro lookups
- no patchers
- no storage
- no networking
- no profile hooks

It only exports `onLoad`, `onUnload`, and a null settings component.

If this plugin cannot be enabled in CloudCord, the problem is outside the
cosmetics code and should be diagnosed from CloudCord's plugin error/log.
