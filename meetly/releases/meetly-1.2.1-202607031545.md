# Meetly 1.2.1

## What's Fixed

### More reliable iCloud sync
- Fixed an iCloud sync failure that could show: "The data couldn't be read because it is missing."
- Meetly now handles older or partially synced iCloud records more gracefully instead of failing the entire sync pass.
- If one synced item is malformed, Meetly keeps syncing the rest of your reminders, dismissals, snoozes, and calendar rules.

## Compatibility

- Existing iCloud data is preserved. You do not need to reset iCloud or reconfigure your calendars.
- Local reminders continue to work if iCloud is temporarily unavailable.

---

Release 1.2.1.
