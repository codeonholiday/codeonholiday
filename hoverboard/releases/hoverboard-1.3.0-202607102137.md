# HoverBoard 1.3.0

Whiteboard drawing gets pressure-sensitive pens, a cleaner inspector, and
several quality-of-life improvements since 1.2.0.

## Pens & pressure

- **Two pens.** The **Pen** draws a clean, constant-width line. The new
  **Fountain Pen** swells and tapers like real ink (shortcut **B**).
- **Real pressure when available.** The Fountain Pen reads pen pressure from
  Force Touch trackpads and drawing tablets (Wacom, Huion).
- **Apple Pencil over Sidecar.** Sidecar does not stream live pressure while
  dragging, so the Fountain Pen shapes each stroke from your drawing speed
  instead — slow strokes thicken, fast flicks thin — with tapered entry and
  exit so strokes no longer end in a blob.
- **Variable-width rendering.** Pressure-sensitive strokes render as a filled
  outline so thickness changes smoothly along the path. Pressures round-trip
  through `.excalidraw` import/export.

## Inspector

- **Collapsible properties panel.** The selection inspector starts as a small
  floating circle to save space on smaller screens. Tap to expand the full
  panel; use the header button to fold it back. The host window resizes
  anchored to its top-left corner.

## Whiteboard (since 1.2.0)

- **Highlighter** — thick, translucent marker with multiply blend.
- **Laser pointer** — transient presentation trail, not saved to the board.
- **Curved arrow**, **drop/paste images**, **line & arrow binding**, and a
  **richer color palette** with an expanded picker.

## Changes

- Removed the **Share** button from the whiteboard toolbar (export options
  remain in the whiteboard menu).
