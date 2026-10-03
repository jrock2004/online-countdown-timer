# Launch Countdown

A countdown timer for streamers counting down to a game launch or a new league start.
Built with Vite, React, TypeScript and Tailwind CSS v4.

## Features

- Create, edit and delete countdowns; switch between several of them.
- Everything is saved to `localStorage`, so your last countdown is there when you come back.
- Light and dark mode: follows your system setting by default, with a System / Light / Dark toggle.

## OBS / stream overlay

Open a countdown and choose **Show on stream** to build a link for an OBS or Streamlabs
browser source (1280×720 works well). The `/obs` route shows only the timer, on a transparent page.

The link carries the countdown itself, so it works in OBS's separate browser. If you edit a
countdown, copy the link again.

| Parameter  | Values                       | Default        |
| ---------- | ---------------------------- | -------------- |
| `title`    | text                         |                |
| `subtitle` | text                         |                |
| `target`   | ISO 8601 date (required)     |                |
| `theme`    | `dark`, `light`              | system         |
| `bg`       | `none` for fully transparent | readable panel |
| `compact`  | `1` to show only the digits  | off            |
| `scale`    | `0.5` to `3`                 | `1`            |
| `done`     | message shown at zero        | It's live!     |

Older `/?overlay=1&…` links still work.

## Accessibility

- Semantic landmarks, a skip link, and a single logical heading structure.
- Every form field has a visible label. Errors are linked with `aria-describedby`, and focus moves to the first invalid field.
- After you create, edit, delete or switch countdowns, focus moves to the new view's heading and a polite live region announces what changed.
- The countdown uses `role="timer"` with a plain-language summary (for example, "3 days, 4 hours and 12 minutes remaining"), so screen readers aren't spammed every second.
- Delete confirmation uses the native `<dialog>` element, which traps focus, closes with Escape and returns focus when it closes.
- Color contrast meets WCAG AA in both themes, focus outlines are visible, buttons are at least 44px tall, and animation is turned off when `prefers-reduced-motion` is set.
- Linted with `eslint-plugin-jsx-a11y` (strict).

## Development

```sh
npm install
npm run dev      # start the dev server
npm test         # unit and component tests (Vitest and Testing Library)
npm run lint
npm run build    # type-check and build to dist/
```

## Deploying to Netlify

`netlify.toml` is already set up (build `npm run build`, publish `dist`, Node 22, security and cache headers).
Connect the repo in Netlify, or run `npx netlify deploy --prod`.
