# Letters

A phonics game for a 5-year-old. Shows an animal emoji with its name missing the first letter — pick the right letter from four options. Vue 3 + Tailwind, runs entirely client-side.

## How it plays

- One question per game: an emoji, a blanked word (`_ion`), and 4 letter buttons.
- Tap the right letter → confetti bursts immediately, the letter fills in, "Play again" appears.
- Tap a wrong letter → it shakes red, no penalty, try again.
- Uses the Web Speech API: says the animal name on load, the letter *sound* (not its name — "luh" not "el") on tap, and a cheer on the correct answer. Fails silently if speech isn't available.

## Tech

- **Vue 3** (`<script setup>`, Composition API) — a single `App.vue`, no router, no store
- **Tailwind CSS** for styling
- **Vite** for dev/build, **pnpm** for packages
- No persistence — no score history, no accounts, per spec

## Getting started

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build      # outputs to dist/
pnpm preview    # serve the production build locally
```

## Deploy

Deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. In the repo settings, set **Pages → Source → GitHub Actions**. The Vite `base` path is set to `/letters/` in `vite.config.js` to match the repo name — update it if the repo is renamed.

## Project structure

```
src/
  App.vue            # the whole game: state, confetti, speech wiring
  lib/
    words.js          # word list, letter sounds, option/distractor generation
    speech.js          # Web Speech API wrapper
```

## Spec

The product spec this was built from is in `spec.md`.
