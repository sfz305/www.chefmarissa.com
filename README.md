# www.chefmarissa.com

Single-page website for **Chef Marissa Mueller** — Traveling Private Chef, Miami Beach FL.  
Built on the [Canvas HTML5 Template](https://themeforest.net/item/canvas-the-multipurpose-html5-template/9228123) (v7) by SemiColonWeb, with a Gulp 4 + BrowserSync build pipeline.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 LTS |
| npm | 9+ |
| Git | any recent |

---

## First-time Setup

```bash
# 1. Clone the repo
git clone https://github.com/sfz305/www.chefmarissa.com.git
cd www.chefmarissa.com

# 2. Install Node dependencies
npm install

# 3. Populate vendor/ from the Canvas template purchase
#    Default path (edit CANVAS_SRC in gulpfile.js if your layout differs):
npm run setup
#    Or override the path at the command line:
gulp setup --canvas-src="C:/path/to/Canvas 7 Files"
```

> **Why is `vendor/` empty?**  
> It contains files from a licensed ThemeForest purchase and is git-ignored.  
> You must run `npm run setup` on every fresh clone before the site will render correctly.

---

## Development

```bash
npm start        # compile css/default.scss → css/default.css, then
                 # launch BrowserSync at http://localhost:3000
                 # — live-reloads on changes to *.scss, *.js, and *.html
```

`npm run serve` is an alias for `npm start`.

To compile SCSS once without starting the server:

```bash
npm run scss     # one-shot SCSS → CSS, no watch, no browser
```

### Files to edit

| File | Purpose |
|---|---|
| `index.html` | Page markup (single source of truth) |
| `css/default.scss` | All custom styles — compiled to `css/default.css` |
| `js/default.js` | Custom JavaScript (contact form, footer year, etc.) |
| `images/` | Site images |

Never edit files inside `vendor/` or `dist/`.

---

## Production Build

```bash
npm run build    # minifies HTML, CSS, and JS → dist/
npm run clean    # deletes dist/ entirely
```

The `dist/` folder is the deployable artefact — it is self-contained and git-ignored.  
Its structure mirrors the project root with `.min` suffixes on CSS/JS.

---

## Deployment

### Netlify / Vercel (recommended)

1. Push the repo to GitHub (vendor assets are git-ignored — that's fine).
2. On Netlify/Vercel, set the **build command** and **publish directory**:

   | Setting | Value |
   |---|---|
   | Build command | `npm run setup && npm run build` |
   | Publish directory | `dist` |
   | Node version | `18` |

3. Set any required environment variables in the Netlify/Vercel dashboard.
4. Each push to `main` triggers an automatic deploy.

> The `npm run setup` step in the build command requires the Canvas template
> source to be accessible. If the default path isn't available in CI, either
> commit a stripped copy of the required vendor files, or host them as a
> build artifact and adjust `CANVAS_SRC` in `gulpfile.js`.

### Static / FTP hosting

```bash
npm run setup    # ensure vendor/ is populated
npm run build    # generate dist/
```

Upload the entire contents of `dist/` to the web root of your host.

### GitHub Pages

```bash
npm run setup
npm run build
npx gh-pages -d dist
```

---

## Project Structure

```
www.chefmarissa.com/
├── .github/
│   └── copilot-instructions.md   Copilot workspace instructions
├── css/
│   └── default.scss              Custom styles  ← edit this
├── js/
│   └── default.js                Custom JavaScript  ← edit this
├── images/
│   ├── hero-elegant.jpg          Hero background
│   ├── chef-marissa-portrait.jpg About section photo
│   ├── chef-marissa-cooking-*.jpg Action shots (1–3)
│   └── gallery/
│       └── dish-*.jpg            Gallery dishes (1–7)
├── vendor/                       Canvas assets (git-ignored, run setup)
├── dist/                         Production build (git-ignored)
├── index.html                    Single-page source markup
├── gulpfile.js                   Gulp build pipeline
├── package.json
└── README.md
```

---

## npm Scripts Reference

| Command | What it does |
|---|---|
| `npm start` | Compile SCSS, launch BrowserSync on port 3000 with live reload |
| `npm run serve` | Alias for `npm start` |
| `npm run scss` | One-shot SCSS → CSS compile (no watch, no server) |
| `npm run setup` | Copy Canvas vendor assets into `vendor/` — run once per machine |
| `npm run build` | Minify HTML, CSS, and JS into `dist/` for deployment |
| `npm run clean` | Delete the `dist/` output folder |

---

## Customising the Site

### Brand colours
Edit the `:root` block at the top of `css/default.scss`:
```scss
:root {
  --cnvs-themecolor:     #c9a96e; /* gold accent */
  --cnvs-themecolor-rgb: 201, 169, 110;
}
```

### Adding a page section
1. Add `<section id="section-NAME" class="page-section">` to `index.html`.
2. Add a matching `<li>` to the `.one-page-menu` nav in `index.html`.
3. Add targeted styles in `css/default.scss`.

### Contact form
Replace the placeholder block in `js/default.js` with a real `fetch()` call
to your endpoint, Netlify Function, or a third-party service
(Formspree, EmailJS, etc.):

```js
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});
```

