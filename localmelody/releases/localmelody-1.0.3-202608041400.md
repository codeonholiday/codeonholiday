<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# LocalMelody 1.0.3

- Fixed runtime setup on Macs where Homebrew Python reports an empty macOS version to uv.
- LocalMelody now uses an isolated Python 3.11 installation managed by uv instead of Homebrew Python.
- Retrying setup continues to recover safely from a partially created virtual environment.
