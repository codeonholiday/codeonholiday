<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# LocalMelody 1.0.6

- Fixed audio playback after generation and in Library by exporting real MP3 files with the resolved Homebrew ffmpeg executable.
- Existing Library files that contain FLAC audio under an MP3 filename are repaired automatically and safely.
- Fixed license activation by preserving the app's Keychain entitlement during release signing.
- The lyrics editor now starts collapsed and expands automatically after lyrics are generated.
