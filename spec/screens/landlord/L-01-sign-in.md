# L-01 · Sign in

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/signin` · also `/signup`, `/reset` |
| **Access** | Public. A signed-in user hitting this route is redirected to `L-03`. |
| **Purpose** | Get the landlord in with the least friction. This screen is not a marketing page. |
| **Leads to** | `L-02` if no properties exist yet, otherwise `L-03` |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L01-FLD-EMAIL` | Text field | Label "Email". Autofocus on desktop only. |
| `L01-FLD-PASS` | Text field | Label "Password". Show/hide toggle on the right. |
| `L01-BTN-SIGNIN` | Primary button | "Sign in". Full width. |
| `L01-LNK-RESET` | Link | "Forgot password" |
| `L01-LNK-SIGNUP` | Link | "Create an account" |

## Interactions

| Trigger | Result |
|---|---|
| `L01-BTN-SIGNIN` | Validate both fields are filled → button shows spinner → on success route to `L-02` or `L-03` → on failure show a single inline error above the form: "Email or password is incorrect." Never say which one is wrong. |
| Enter key in either field | Same as pressing `L01-BTN-SIGNIN` |
| `L01-LNK-RESET` | Route to `/reset`. Sending a reset always shows the same confirmation whether or not the email exists. |

## Rules

- Password minimum 8 characters on sign-up, with strength shown as a
  single word, not a bar.
- After five failed attempts, add a 30-second delay and say so plainly.
- Session persists for 30 days on a trusted device.
