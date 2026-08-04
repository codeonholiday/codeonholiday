<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# LocalMelody 1.0.5

- Fixed license activation failing with “A required entitlement isn't present.”
- Release signing now preserves the app's Keychain access-group entitlement.
- Release validation now blocks publishing if the final signed app is missing its Keychain entitlement.
