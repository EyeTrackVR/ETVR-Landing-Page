# ETVR-Landing-Page

Static landing page for EyeTrackVR. Built with HTML, CSS, local SVG icons, and small JavaScript enhancements for cursor-following hover highlights and a mobile hamburger menu. Navigation and content remain usable without JavaScript.

## Local preview

Run `python3 serve.py` in this directory, then open http://localhost:4173.

`serve.py` is the stdlib server with one change: a missing path returns `404.html` with a real 404 status, the way GitHub Pages does. Plain `python3 -m http.server` shows its own error page instead, so use `serve.py` if you want to see the 404 locally.

The page respects reduced-motion preferences and include accessible icon labels, keyboard focus states, and responsive layouts.

## Icons

`assets/favicon-32.png`, `assets/favicon.png` and `assets/apple-touch-icon.png` are generated from `logo_no_bg.png`. The logo is white on transparent, so each tile puts it on the `--background` colour, otherwise it disappears in a light browser tab. Regenerate them if the logo ever changes.

## 404 page

`404.html` is served by GitHub Pages for any unknown path. It reuses `styles.css` and only adds `404.css` for its own rules. Its own asset paths are root-relative (`/styles.css`, `/icons.svg`) so it still loads correctly when someone requests a path with extra segments in it. If you add a page to the site, add it to the nav in both `index.html` and `404.html`.

https://www.eyetrackvr.dev
