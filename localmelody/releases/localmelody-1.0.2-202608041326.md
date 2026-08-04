<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# LocalMelody 1.0.2

- Fixed Python runtime setup on systems where Homebrew's Python 3.11 could not be used.
- Setup now resolves Homebrew tools from their installed prefixes and repairs Python 3.11 automatically when needed.
- Retrying setup now recovers from a partially created virtual environment.
