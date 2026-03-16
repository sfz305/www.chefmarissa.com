# canvas-html

A single-page website built on the [Canvas HTML5 Template](https://themeforest.net/item/canvas-the-multipurpose-html5-template/9228123) (v7) by SemiColonWeb. Custom source files live in `css/`, `js/`, and `index.html`; the Canvas framework assets are kept outside version control.

## Quick Start

```bash
# 1. Install Node dependencies
npm install

# 2. Copy Canvas vendor assets from the template directory
npm run setup
# For a custom template path:
# gulp setup --canvas-src="C:/path/to/Canvas 7 Files"

# 3. Start the live development server (port 3000)
npm start
```

The browser opens automatically at `http://localhost:3000`. Changes to `css/default.scss`, `js/default.js`, or `index.html` are reflected instantly.

## Project Structure

```
canvas-html/
├── .github/
│   └── copilot-instructions.md   GitHub Copilot workspace instructions
├── css/
│   └── default.scss              Custom styles (edit this)
├── js/
│   └── default.js                Custom JavaScript (edit this)
├── images/                       Site images
├── vendor/                       Canvas assets (git-ignored, populated by setup)
├── dist/                         Production build (git-ignored)
├── index.html                    Single-page HTML source
├── gulpfile.js                   Gulp build pipeline
└── package.json
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Compile SCSS + start BrowserSync dev server |
| `npm run build` | Production build → `dist/` |
| `npm run setup` | Copy Canvas vendor assets into `vendor/` |
| `npm run clean` | Delete `dist/` |
| `npm run scss` | Compile SCSS once |

## Customising the Site

### Colours & Theme
Edit the `:root` block at the top of `css/default.scss`:
```scss
:root {
  --cnvs-themecolor:     #3d6ef5; /* primary accent */
  --cnvs-themecolor-rgb: 61, 110, 245;
}
```

### Adding a Section
1. Add `<section id="section-NAME" class="page-section">` to `index.html`.
2. Add a matching `<li>` to the `.one-page-menu` nav list.
3. Style it in `css/default.scss`.

### Contact Form
Replace the `setTimeout` demo block in `js/default.js` with a real
`fetch()` call to your back-end, Netlify Function, or third-party service
(Formspree, EmailJS, etc.).

## Notes

- `vendor/` is git-ignored because it contains files from a licensed
  ThemeForest purchase. Run `npm run setup` on each new machine.
- `dist/` is generated; never edit it manually.
- The Canvas file path expected by `gulp setup` defaults to:
  `../Purchased Software/themeforest-k0KRh5qD-canvas-the-multipurpose-html5-template/Package-HTML/Canvas 7 Files`
  Adjust `CANVAS_SRC` in `gulpfile.js` or pass `--canvas-src` if your layout differs.
