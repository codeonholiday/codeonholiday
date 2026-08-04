<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# LocalMelody 1.0.4

- Fixed setup failing to pull the default lyrics model when the Ollama server was not running.
- LocalMelody now starts the Homebrew Ollama service automatically and waits for it to become ready.
- Ollama is resolved from its Homebrew installation prefix instead of a hard-coded executable path.
