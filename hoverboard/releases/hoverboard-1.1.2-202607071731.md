# HoverBoard 1.1.2

Release 1.1.2.

## Whiteboard performance

Large boards now stay smooth while dragging, resizing, and rotating.

- **Cached paper texture** — the procedural paper grain is rasterized once instead of being redrawn on every frame.
- **Smoother live transforms** — elements you drag no longer regenerate their hand-drawn rough outline every frame; it snaps back into place when you release.
- **Faster hot-path accessors** — board lookups and selection bounds are cached during gestures.
- **Skipped no-op work** — arrow-binding and container-text refreshes are bypassed on boards that don't use them.

## Fixes

- **Freeze zoom now magnifies the captured screen**, not just the annotations. Zooming and panning in Freeze keeps your annotations aligned with the underlying screen content.

## Removed

- **Zoom Loupe** has been removed. Draw, Freeze, Whiteboard, Spotlight, Cursor Halo, and Break Timer are unaffected.
