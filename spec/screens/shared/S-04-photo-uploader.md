# S-04 · Photo uploader

Source: UI/UX Specification v1.0, Part D.

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `S04-ZONE` | Drop zone | Tap to choose or take a photo; drag and drop on desktop. Camera opens directly on mobile. |
| `S04-THUMB` | Thumbnail | Shows immediately from the local file while the upload runs, with a progress ring. Tap to enlarge, X to remove. |
| `S04-ERR` | Inline error | "That file is too large" or "That file type is not supported" — on the thumbnail, not as a popup |

## Rules

- Images are compressed on the device before upload. A 6MB phone photo
  should leave as roughly 400KB.
- Maximum 3 photos on tenant screens, 10 on landlord screens.
- Upload continues if the user scrolls. Submitting while an upload is in
  progress waits for it, with the button showing "Uploading photo…".
