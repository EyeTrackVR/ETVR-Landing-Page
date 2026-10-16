# ETVR-Landing-Page

Static landing page for EyeTrackVR. Built with HTML, CSS, local SVG icons, and small JavaScript enhancements for cursor-following hover highlights and a mobile hamburger menu. Navigation and content remain usable without JavaScript.

## Local preview

Run `python3 -m http.server 4173` in this directory, then open http://localhost:4173.

The page respects reduced-motion preferences and include accessible icon labels, keyboard focus states, and responsive layouts.

## 404 page

`404.html` is served by GitHub Pages for any unknown path. It reuses `styles.css` and only adds `404.css` for its own rules. Its own asset paths are root-relative (`/styles.css`, `/icons.svg`) so it still loads correctly when someone requests a path with extra segments in it. If you add a page to the site, add it to the nav in both `index.html` and `404.html`.

https://www.eyetrackvr.dev
