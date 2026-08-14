---
title: How to Use HoverBoard Whiteboard — Mindmaps, Diagrams, and Teaching Widgets
description: "A detailed guide to HoverBoard Whiteboard: infinite canvas, mindmaps, connectors, sticky notes, checklists, media links, architecture stencils, and exports on macOS."
date: 2026-07-23
updated: 2026-07-23
tags: [hoverboard, macos, whiteboard, mindmap, diagram, teaching, guide]
image: ./assets/how-to-use-hoverboard-complete-guide/whiteboard.webp
author: codeonholiday
draft: false
---

HoverBoard Whiteboard is a local infinite canvas for explaining ideas without leaving your presentation. It is separate from Freeze: Freeze holds a screen snapshot, while Whiteboard gives you a blank space for diagrams, mindmaps, lesson plans, system design, and visual notes.

## Watch Whiteboard in action

See how to build a board, connect ideas, and turn it into a useful visual explanation:

:::youtube https://youtu.be/l76PhL-KIf4
:::

## Open a board

The default shortcut is **⌃⌥W**. Whiteboard opens from the menu bar or Settings as a Pro tool with a 60-second trial. Boards are stored locally and autosaved; there is no account, cloud workspace, or collaboration backend.

Create multiple boards for different subjects, rename them, duplicate a useful template, switch between them, or delete old boards from the board library. HoverBoard migrates older local whiteboard data into the versioned library format when needed.

## The canvas model

The canvas is infinite: zoom and pan to move between an overview and a close-up explanation. Add shapes, lines, arrows, freehand strokes, text, and numbered markers. Select one or several elements to move, resize, rotate, lock, reorder, or edit their properties.

Connectors can bind to shapes. When a connected shape moves, its arrow follows the shape instead of becoming a loose line. This makes the board useful for flowcharts and architecture diagrams, not only freehand sketches.

The property panel changes with the selection. Depending on the element, you can adjust stroke and fill, opacity, width, roughness, dash style, rounded corners, font family, alignment, and hyperlinks.

## Build a mindmap quickly

Mindmaps are the fastest way to turn a vague explanation into a structure:

1. Start a mindmap at the center of the board.
2. Type the root idea, such as “Launch a product”.
3. Press **Tab** to add a child node.
4. Press **Return** to add a sibling at the same level.
5. Use **⌘⇧L** to arrange the tree.
6. Collapse a branch when you want to focus on one part.

New children inherit useful style information from their parent. The layout engine keeps branches readable as you build. Use a tree arrangement for an outline and a radial arrangement when the root concept should remain visually central.

## Teaching widgets

The Annotation or Stencil menus contain ready-made blocks that would otherwise take several manual elements to draw:

- **Paper** adds a board color and patterns such as dots, grid, lines, graph, or isometric.
- **Sticky note** creates a quick colored reminder or question.
- **Callout** creates a speech-style card for an explanation.
- **Checklist** gives you a title, items, and an Add row for agendas or exercises.
- **Frame** groups a region with a title.
- **Quote** creates an attributed quote card.
- **Polaroid** holds an image and editable caption.
- **Media link** turns a YouTube, video, or audio URL into a playable board card.
- **Highlight box, Redaction, and Step badge** emphasize, hide, or number content.

Widgets remain part of the same infinite canvas. Move and resize them alongside ordinary shapes instead of exporting each object separately.

## Architecture stencils

For system-design explanations, use architecture stencils rather than drawing every rectangle by hand. The library includes categories such as:

- **Compute:** Web App, Service, Auth Service, Client/User, Worker
- **Data:** Database, PostgreSQL, Cache, Redis, Object Storage
- **Messaging:** Queue and Event Stream
- **Network:** Load Balancer, API Gateway, External API, CDN
- **Infrastructure:** Cloud, Region/VPC, Kubernetes/Cluster

Drop a block, connect it with arrows, and use the property panel to tune the visual language. This is useful during design reviews when the diagram needs to be understandable before it needs to be perfect.

## Export and copy

Export the visible board to **PNG**, the full board to **SVG**, or the editable document to **Excalidraw**. Use PNG for slides and handouts, SVG for crisp diagrams, and Excalidraw when someone else should continue editing the source.

Clipboard support includes native board data, Excalidraw JSON, and SVG. Unsupported elements are retained where possible so a round trip does not silently destroy content.

## Whiteboard and screen sharing

Whiteboard is local by default. The board itself is not uploaded. When you share your screen, the audience sees the board only if the Whiteboard window is inside the shared display or window. Keep a private board for preparation and open a separate teaching board when viewers should follow along.

## Whiteboard versus Notes

Use **Whiteboard** for spatial thinking: branches, arrows, shapes, images, and a diagram people can see. Use [Notes](/blog/how-to-use-hoverboard-notes/) for linear Markdown, speaker prompts, search, and rendered documents. They complement each other during a lesson: Notes holds the script, Whiteboard holds the explanation.

## Troubleshooting

If a board does not appear, open the board library and verify the selected document. If hotkeys do nothing, enable Accessibility and check Settings → Hotkeys. If an export looks incomplete, wait for autosave to finish, select the intended board, and export again.

Whiteboard is a Pro feature after its 60-second trial. Pro includes unlimited boards, exports, and the rest of HoverBoard’s advanced presentation tools.
