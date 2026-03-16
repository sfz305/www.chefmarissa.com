# GitHub Copilot — Workspace Instructions
# canvas-html

> These instructions are automatically applied to every Copilot interaction
> in this workspace (`applyTo: "**"`).

---

## Project Overview

**canvas-html** is a single-page website built on top of the
[Canvas HTML5 Template](https://themeforest.net/item/canvas-the-multipurpose-html5-template/9228123)
(v7) by SemiColonWeb. It is developed with Gulp 4 and BrowserSync for live
reloading.

### Core technologies

| Layer | Stack |
|-------|-------|
| Markup | HTML5, semantic sectioning |
| Styling | SCSS → CSS (compiled via Gulp + `gulp-sass`) |
| Scripts | Vanilla ES6+ (`js/default.js`) |
| Framework | Canvas v7 (Bootstrap 5 + jQuery + Swiper + UIcons) — in `vendor/` |
| Build | Gulp 4, BrowserSync |
| Hosting | Static site (no server-side logic required) |

---

## Repository Structure

```
canvas-html/
├── .github/
│   └── copilot-instructions.md   ← you are here
├── css/
│   └── default.scss              ← ONLY file to edit for styles
├── js/
│   └── default.js                ← ONLY file to edit for scripts
├── images/                       ← site images (hero, about, portfolio…)
├── vendor/                       ← Canvas template assets (git-ignored)
│   ├── style.css                 ← Canvas core styles (do NOT edit)
│   ├── css/
│   │   ├── font-icons.css
│   │   ├── swiper.css
│   │   └── icons/
│   └── js/
│       ├── plugins.min.js
│       └── functions.bundle.js
├── dist/                         ← production build output (git-ignored)
├── index.html                    ← single-page source markup
├── gulpfile.js                   ← build pipeline
├── package.json
└── .gitignore
```

---

## Development Workflow

```bash
# 1. Install dependencies (first time)
npm install

# 2. Populate vendor/ from the Canvas template (first time, or after updates)
npm run setup
# or: gulp setup --canvas-src="path/to/Canvas 7 Files"

# 3. Start the live dev server (compiles SCSS + hot-reloads on change)
npm start        # equivalent to: gulp

# 4. Production build → dist/
npm run build    # equivalent to: gulp build
```

### Gulp tasks summary

| Task | Command | What it does |
|------|---------|-------------|
| `default` | `gulp` / `npm start` | Compile SCSS, then launch BrowserSync on port 3000 |
| `serve` | `gulp serve` | Same as default |
| `scss` | `gulp scss` | Compile `css/default.scss` once |
| `setup` | `gulp setup` / `npm run setup` | Copy Canvas vendor assets into `vendor/` |
| `build` | `gulp build` / `npm run build` | Minify all assets → `dist/` |
| `clean` | `gulp clean` | Delete `dist/` |

---

## Editing Guidelines

### Adding or modifying styles

1. Edit **`css/default.scss`** only — never edit `vendor/style.css`.
2. Override Canvas CSS variables inside `:root {}` at the top of the file.
3. The primary accent colour is `--cnvs-themecolor: #3d6ef5;`.
4. Use the existing SCSS nesting structure: one top-level comment block per
   site section (About, Services, Portfolio, etc.).
5. Avoid `!important`; target more specific selectors instead.

### Modifying JavaScript

1. Edit **`js/default.js`** only — never edit vendor JS files.
2. The file is a self-executing IIFE in strict mode.
3. Use `document.querySelector` / `document.querySelectorAll` (not jQuery).
4. Append new standalone features as named functions inside the IIFE.
5. Always sanitise user-supplied values with `textContent` (not `innerHTML`).

### Adding a new page section

1. In `index.html`, add a `<section id="section-YOURNAME" class="page-section">`.
2. Add a matching `<li>` to `<ul class="menu-container one-page-menu">`.
3. Add targeted SCSS inside `css/default.scss` under a clearly labelled block.
4. Any interactive behaviour goes in `js/default.js`.

### Canvas classes to know

| Class | Purpose |
|-------|---------|
| `.page-section` | Full-width section with standard vertical padding |
| `.heading-block` | Section title + subtitle block |
| `.feature-box .fbox-center .fbox-outline .fbox-rounded` | Icon feature cards |
| `.portfolio-item` | Portfolio card wrapper |
| `.dark` | Applies the Canvas dark-background colour scheme |
| `.stretched` | Body class: full-width layout (no container constraint at root) |
| `.one-page-menu` | Nav `<ul>` that activates Canvas smooth-scroll between sections |
| `data-animate="fadeInUp"` | Triggers Canvas entrance animation |
| `data-delay="200"` | Delay (ms) before animation fires |
| `.swiper-parent` | Full-screen hero carousel |
| `.slider-parallax` | Adds parallax depth to the hero |

### Canvas JavaScript options

Customise Canvas behaviour by declaring `cnvsOptions` before the vendor
scripts load (or at the top of `js/default.js`):

```js
window.cnvsOptions = {
  headerSticky:       true,
  smoothScroll:       false,
  scrollOffset:       70,
  menuBreakpoint:     992,
};
```

---

## Asset Paths

| Path in source HTML | Resolves to |
|---------------------|-------------|
| `vendor/style.css` | Canvas compiled core CSS |
| `vendor/css/font-icons.css` | Unicons icon font |
| `vendor/css/swiper.css` | Swiper carousel CSS |
| `vendor/js/plugins.min.js` | All third-party plugins bundled |
| `vendor/js/functions.bundle.js` | Canvas core JavaScript |
| `css/default.css` | Compiled from `css/default.scss` |
| `js/default.js` | Custom site JavaScript |

In `dist/`, the custom CSS and JS paths are rewritten to `.min` variants
by the Gulp build task.

---

## Security Notes

- All user-facing dynamic text must be written via `textContent`, **never**
  `innerHTML`, to prevent XSS.
- Form submissions should be sent to a server-side endpoint or serverless
  function — see the placeholder comment in `js/default.js`.
- The `vendor/` and `dist/` directories are git-ignored; do not commit
  licensed Canvas files to a public repository.
- Never hard-code secrets (API keys, tokens) in HTML or JS source files.

---

## Code Style

- **HTML**: 2-space indent, semantic elements, `lang` and ARIA attributes where
  appropriate.
- **SCSS**: 1-tab indent, BEM-inspired class names for custom components,
  `&` nesting for state/child variants.
- **JS**: `'use strict'`, `const`/`let` only (no `var`), named functions,
  consistent `camelCase` variable names.
- **Commits**: conventional-commit style —
  `feat:`, `fix:`, `style:`, `chore:`, `docs:`.
