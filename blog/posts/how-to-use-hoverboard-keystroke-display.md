---
title: How to Use HoverBoard Keystroke Display — Show Shortcuts Live
description: Learn how HoverBoard Keystroke Display shows modifier chords and app shortcuts on screen, how to grant Input Monitoring permission, and how to present safely.
date: 2026-07-23
updated: 2026-07-28
tags: [hoverboard, macos, keystroke-display, shortcuts, teaching, guide]
image: ./assets/how-to-use-hoverboard-complete-guide/keystroke.webp
author: codeonholiday
draft: false
---

Keystroke Display puts the keys you press into a small on-screen HUD. It is designed for shortcut tutorials, coding lessons, Stream Deck demonstrations, and any presentation where saying “press Command plus K” is less clear than showing the chord as it happens.

## Activate the HUD

The default shortcut is **⌃⌥K**. You can also open Keystroke Display from the menu bar. The first time you enable it, HoverBoard asks for a privacy confirmation because the feature must observe keyboard events in order to show them. macOS may also require Input Monitoring permission.

Grant permission only if you are comfortable with the feature. HoverBoard uses the events to render the HUD locally; do not enable it while entering passwords, payment details, or other secrets. Press **Esc** to close the display.

## What appears on screen

Keystroke Display shows ordinary keys, modifier combinations, and simultaneous keys. Holding a modifier and pressing a key produces one live chord chip, such as **⌘C**, instead of separate overlapping chips. Simultaneous independent keys can appear as **A + S**.

This is useful when the shortcut itself is the content. For a tutorial, slow down enough for the chip to be readable, then perform the action once. The HUD can show app shortcuts and global shortcuts through its listen-only event tap, so viewers can follow menu commands as well as HoverBoard controls.

## Make a shortcut demo readable

1. Open the app or slide where the shortcut will be used.
2. Enable **⌃⌥K** and confirm the privacy prompt.
3. Increase the display size or adjust its position in Settings if the audience is remote.
4. Press the chord deliberately and pause for the HUD to appear.
5. Explain the result, then press **Esc** when the shortcut section is finished.

Do not hold random keys while talking. The HUD is strongest when the keypress is a visual caption for one clear action.

## Privacy and permissions

Keyboard visibility is inherently sensitive, which is why HoverBoard asks for confirmation before first use. Input Monitoring and Accessibility permissions are controlled by macOS in System Settings → Privacy & Security. HoverBoard has no backend for your key events and does not need an account.

Use the mode only for demonstrations where showing the input is intentional. Turn it off before typing credentials, private messages, or unpublished information.

## Trial and Pro access

Keystroke Display includes a 60-second Pro trial each time you open it. Pro unlocks unlimited use. Draw also has a 60-second Pro preview; Spotlight and Break Timer remain free forever and never show a trial countdown.

## Troubleshooting

### The HUD stays empty

Confirm the privacy acknowledgment, then enable HoverBoard under Input Monitoring and Accessibility. Quit and relaunch if macOS asks for a restart. Check Settings → Hotkeys if the activation shortcut is not responding.

### App shortcuts do not appear

Recent HoverBoard builds use a listen-only event tap to observe app and global shortcuts. Make sure Input Monitoring is enabled, and test with a visible shortcut such as opening a menu rather than a password field.

### A chord looks duplicated

Release and press the modifier/key combination again. Current builds update a single live chip while a chord is held and combine simultaneous keys into one readable display.

Keystroke Display turns invisible keyboard muscle memory into something the audience can actually learn.
