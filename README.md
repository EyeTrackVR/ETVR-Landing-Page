# ETVR-Landing-Page

Static landing page for EyeTrackVR. Built with HTML, CSS, an SVG icon sprite, and small JavaScript enhancements for the light/dark theme toggle and a mobile hamburger menu. Navigation and content remain usable without JavaScript.

## Style

The page shares its palette and type with the docs site ([EyeTrackVR-Docs](https://github.com/EyeTrackVR/EyeTrackVR-Docs), `vitepress/docs/src/styles/theme.css`): warm paper, near-black ink, the EyeTrackVR purple as the one accent, and Atkinson Hyperlegible for text. It opens in light mode; the toggle in the header switches to dark and remembers the choice. Keep it plain: no glows, gradients or decorative icons. If the tokens at the top of `styles.css` change, change them in the docs theme too.

## Local preview

Run `python3 serve.py` in this directory, then open http://localhost:4173.

`serve.py` is the stdlib server with one change: a missing path returns `404.html` with a real 404 status, the way GitHub Pages does. Plain `python3 -m http.server` shows its own error page instead, so use `serve.py` if you want to see the 404 locally.

The page respects reduced-motion preferences and include accessible icon labels, keyboard focus states, and responsive layouts.

## Icons

`icons.svg` is a sprite built from official icon packs, with one exception: [Lucide](https://lucide.dev) for interface icons and [Phosphor Icons](https://phosphoricons.com) for the Discord mark. The GitHub mark is the site's original outline drawing, kept so it matches the line style. A comment at the top of the sprite maps each id to its source icon. To add or swap one, copy it from the pack and keep the pack's licence notice current in `ICON-LICENSES.md`. Stroke width, caps and joins are set in `styles.css` (`.icon`), so Lucide icons are used without their own stroke attributes.

The favicon files are separate:

`assets/favicon-32.png`, `assets/favicon.png` and `assets/apple-touch-icon.png` are generated from `logo_no_bg.png`. The logo is white on transparent, so each tile puts it on a dark background, otherwise it disappears in a light browser tab. Regenerate them if the logo ever changes.

The header uses two copies of the mark for the same reason: `assets/logo_tile.svg` (the white logo on a rounded dark tile) in light mode and `assets/logo_no_bg.svg` in dark mode. Both come from the docs repo.

## Link previews

`index.html` carries Open Graph and Twitter card tags so sharing the site on Discord, X, Slack or in a message shows a title, description and image instead of a bare URL. The card is the compact kind (`twitter:card` is `summary`): the title and description with `assets/og-mark.png`, a 512x512 logo tile, as a small thumbnail. It is the same file the docs use, generated there by `vitepress/scripts/make_og_image.py`.

The earlier wide banner is still in the repo but no longer referenced: `assets/og-image.png` (1200x630) and its source `tools/og-card.html`. To go back to it, point `og:image` and `twitter:image` at it, set the width and height to 1200 and 630, and set `twitter:card` to `summary_large_image`.

The `og:` and `twitter:` tags use absolute URLs on `https://www.eyetrackvr.dev`, so they only resolve once pushed. `404.html` deliberately has no preview tags, it is marked `noindex`.

## Canonical

`index.html` declares `https://www.eyetrackvr.dev/` as canonical, since `/` and `/index.html` both serve the same page.

## 404 page

`404.html` is served by GitHub Pages for any unknown path. It reuses `styles.css` and only adds `404.css` for its own rules. Its own asset paths are root-relative (`/styles.css`, `/icons.svg`) so it still loads correctly when someone requests a path with extra segments in it. If you add a page to the site, add it to the nav in both `index.html` and `404.html`.

https://www.eyetrackvr.dev
