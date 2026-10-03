# Launch Countdown

A countdown timer for streamers counting down to a game launch or a new league start.
Built with Vite, React, TypeScript and Tailwind CSS v4.

## Features

- Create, edit and delete countdowns; switch between several of them.
- Everything is saved to `localStorage`, so your last countdown is there when you come back.
- Light and dark mode: follows your system setting by default, with a System / Light / Dark toggle.
- **Stream overlay**: "Copy overlay link" gives a URL you can add as a browser source in OBS or
  Streamlabs. It shows only the countdown and keeps working on its own, since the timer is in the URL.
  Parameters: `?overlay=1&title=…&subtitle=…&target=<ISO date>&theme=light|dark`.

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
