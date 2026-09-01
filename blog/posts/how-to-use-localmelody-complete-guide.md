---
title: How to Use LocalMelody — A Complete Guide
description: Install LocalMelody on Apple Silicon, set up Homebrew and Ollama, download models, generate music locally, and unlock Pro features without uploading your ideas.
date: 2026-09-01
updated: 2026-09-01
tags: [localmelody, macos, guide, ai-music, privacy]
image: /localmelody/og-image.png
author: codeonholiday
draft: false
---

LocalMelody is a native **local AI music generator for Mac**. After setup, it turns a prompt into music, lyrics, and vocals on your Apple Silicon machine. Prompts and generated audio are not sent to a codeonholiday backend.

This guide covers requirements, install, first-time setup, daily generation, Free vs Pro, privacy, and troubleshooting. Download from the [LocalMelody page](/localmelody/) when you are ready.

## See it in action

:::youtube https://www.youtube.com/embed/TPNFZ3LRSWw
:::

![LocalMelody private AI music studio for Mac](/localmelody/og-image.png)

## What you need

| Requirement | Detail |
| --- | --- |
| Chip | Apple Silicon (M1 / M2 / M3 / M4 and later) |
| OS | macOS 14 Sonoma or later |
| RAM | 16 GB minimum; **32 GB+ recommended** for smoother, higher-quality generation |
| Disk | Space for the app, runtime, and models (models are large — plan for several GB) |
| Network | Needed for first-time runtime / model downloads, license activation, and updates |

Intel Macs are not supported. Generation is built around on-device Apple Silicon workloads.

## Install LocalMelody

1. Download the latest `.dmg` from the [LocalMelody product page](/localmelody/) or GitHub Releases.
2. Open the disk image and drag **LocalMelody** into Applications.
3. Launch the app. If macOS Gatekeeper warns about an unidentified developer, open **System Settings → Privacy & Security** and allow the app, or right-click → **Open** the first time.

## First-time setup (Homebrew, Ollama, models)

LocalMelody does not ship every model inside the DMG. On first launch you install supporting tools and download the runtime / models from inside the app:

1. Install **Homebrew** if you do not already have it (the app points you at the standard install path).
2. Install **Ollama** when prompted — LocalMelody uses it to manage local model downloads.
3. Inside LocalMelody, download the **runtime** and the **music / lyrics models** you want to use.
4. Wait for downloads to finish before generating. Large models take time and disk space.

Internet is required for this step. After models are on disk, generation runs locally.

## Create your first song

1. Open LocalMelody and start from a text prompt — a mood, genre, or short story.
2. Choose whether you want **instrumental** (MusicGen-style workflow) or **music with vocals** (ACE-Step-style workflow), depending on what is available in your build.
3. On **Free**, generations are capped at **15 seconds** with automatic sound controls.
4. Play the result from the Library. Iterate on the prompt until the vibe is right.

Keep prompts concrete: tempo, instruments, emotion, and structure (“lo-fi verse, warm pads, no drums”) usually work better than one vague adjective.

## Shape the sound (Pro)

**Pro Lifetime** unlocks the full studio controls:

- Song length from **15 to 240 seconds**
- Genre, mood, voice, BPM, and key controls
- Voice reference and lyrics refinement
- Export of audio and lyrics

Buy Pro once through Lemon Squeezy from the [pricing section](/localmelody/#pricing) or in-app upgrade. It is a **one-time** purchase, not a subscription.

## Free vs Pro at a glance

| | Free | Pro Lifetime |
| --- | --- | --- |
| Price | $0 | $9.99 one-time |
| Length | 15-second songs | 15–240 seconds |
| Sound controls | Automatic | Genre, mood, voice, BPM, key |
| Lyrics | Generation | Generation + refinement |
| Voice reference | — | Yes |
| Export | Local playback / Library | Audio and lyrics export |

## Privacy: what stays on your Mac

- Prompts, lyrics, generated audio, and Library data live in macOS Application Support on your machine.
- LocalMelody does **not** operate a backend that stores your creative content.
- The app still contacts third parties for **licensing**, **Sparkle updates** (GitHub release assets), and **model / runtime downloads** (including Ollama / model providers).
- Payment is handled by **Lemon Squeezy**; codeonholiday does not store card details.

Read the full [Privacy Policy](/localmelody/privacy.html) if you need the legal detail.

## Compare to cloud AI music

If you are choosing between cloud studios and a local Mac app:

- [LocalMelody vs Suno](/blog/localmelody-vs-suno/)
- [LocalMelody vs Udio](/blog/localmelody-vs-udio/)
- [Suno vs Udio vs LocalMelody](/blog/suno-vs-udio-vs-localmelody/)
- [Best local AI music generator for Mac](/blog/best-local-ai-music-generator-mac/)

## Troubleshooting

### Generation is slow or the Mac fans spin hard

Local AI music is heavy. Close other memory-hungry apps, prefer 32 GB+ RAM when possible, and start with shorter Free generations while you learn the workflow.

### Models will not download

Confirm you are online, Homebrew / Ollama finished installing, and you have enough free disk space. Retry the in-app download after a failed network blip.

### License will not activate

Pro activation needs network access to Lemon Squeezy. Check the key was pasted correctly and that the Mac clock is accurate.

### Updates missing

LocalMelody uses Sparkle with GitHub-hosted releases. Open the app’s update check, or download the latest DMG from the product page.

## Next steps

1. Finish first-time setup and generate a 15-second Free track.
2. Try a more specific prompt (genre + mood + instruments).
3. Upgrade to Pro when you need longer songs, exports, or finer controls.
4. Keep comparing [cloud vs local](/blog/suno-vs-udio-vs-localmelody/) if you are still deciding where generation should run.

Questions? Email [hello@codeonholiday.com](mailto:hello@codeonholiday.com).
