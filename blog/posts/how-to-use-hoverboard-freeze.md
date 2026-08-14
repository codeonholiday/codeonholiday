---
title: How to Use HoverBoard Freeze & Explain — Pause the Screen and Teach Clearly
description: Learn how HoverBoard Freeze captures a screen snapshot for calm step-by-step explanations, annotations, session capture, and live presenting on macOS.
date: 2026-07-23
updated: 2026-07-28
tags: [hoverboard, macos, freeze, presentation, teaching, guide]
image: ./assets/how-to-use-hoverboard-complete-guide/freeze.webp
author: codeonholiday
draft: false
---

Freeze & Explain captures the screen as a still image and lets you annotate that image while the audience sees a stable frame. It solves a common presentation problem: the interface changes, a page loads, or a cursor moves just as you begin explaining it.

## Watch Freeze & Explain in action

See how Freeze creates a stable frame for a calm walkthrough:

:::youtube https://youtu.be/4o1RJV-VCu8
:::

## When to use Freeze

Freeze is especially useful for:

- Explaining a busy diagram one section at a time.
- Walking through a settings panel without the live app changing underneath you.
- Capturing a browser or IDE state before a navigation step.
- Giving the audience time to read while you prepare the next point.
- Saving a useful presentation frame into a local Session.

The frozen image is a snapshot. It does not pause the source app or stop a video call; it places the snapshot above it as a presentation layer.

## Activate Freeze

The default shortcut is **⌃⌥F**. You can also choose Freeze from the menu bar. On activation, HoverBoard captures the display and opens the Freeze toolbar. Accessibility permission is used for global control; Screen Recording permission is required for the screen capture itself.

Use the same Draw tools over the frozen image: pen, arrow, rectangle, number marker, eraser, colors, undo, clear, and reset. Press **Esc** when you want to return to the live screen.

## Explain a frozen frame step by step

The cleanest workflow is deliberate and sparse:

1. Open the slide, app state, or diagram you want to explain.
2. Press **⌃⌥F** before the screen changes.
3. Start with a number marker at the first important area.
4. Add an arrow or rectangle, then explain only that area.
5. Clear or undo marks between steps when the drawing becomes noisy.
6. Save the frame to Sessions if it should become part of your recap.
7. Press **Esc** to resume the live screen.

Freeze is not a replacement for a screenshot editor. Its strength is that the capture and annotation happen in the middle of a live presentation, with no detour to another app.

## Save a frame to Sessions

On Pro, use **Save to Session** in the toolbar to add the current Freeze frame to the local Sessions library. This captures the visible frame and its annotations as a presentation artifact. You can continue presenting, save another frame, and later reorder the set or export it as PNG files or a multi-page PDF.

Saving frames as you teach is useful for a workshop recap, a lesson handout, or a record of the decisions made during a design review.

## Freeze versus Draw

Choose **Draw** when the underlying screen should stay live and clickable. Choose **Freeze** when stability matters more than interaction:

| Situation | Best mode |
| --- | --- |
| Point at a live website or app | Draw |
| Explain a screen that is about to navigate | Freeze |
| Build a diagram from scratch | Whiteboard |
| Assemble several explained frames | Sessions |

You can move between modes with their global shortcuts, but close the active overlay first when you want a clean transition.

## Trial and Pro access

Freeze is a Pro feature with a 60-second trial each time you open it. A countdown pill shows the remaining preview time. Draw has the same 60-second Pro preview; Spotlight and Break Timer remain free forever. Unlock Pro for unlimited Freeze use, Save to Session, exports, and the rest of the Pro tools.

## Permission troubleshooting

### The capture is blank or unavailable

Open System Settings → Privacy & Security → Screen Recording and enable HoverBoard. Quit and relaunch the app if macOS asks for a restart before the permission takes effect.

### Freeze opens but the hotkey does not work

Enable HoverBoard under Accessibility, then review Settings → Hotkeys. Conflicts with meeting apps, launchers, or other overlay tools are common; remap the shortcut if needed.

### I want the live screen back

Press **Esc**. Freeze closes the overlay and returns interaction to the underlying app. The source application was never paused.

Freeze gives a presentation its most valuable resource: a few calm seconds to explain what the audience is looking at.
