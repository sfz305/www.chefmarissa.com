'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// canvas-html — Gulpfile
//
// Tasks:
//   gulp            → compile SCSS then launch BrowserSync dev server (default)
//   gulp serve      → launch BrowserSync without recompiling first
//   gulp scss       → compile css/default.scss once
//   gulp build      → production build → dist/
//   gulp setup      → copy Canvas vendor assets from the template directory
//   gulp clean      → delete dist/
//
// Flags:
//   --canvas-src=<path>  override the Canvas template directory at runtime
// ─────────────────────────────────────────────────────────────────────────────

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const {series, parallel, src, dest} = require('gulp');
const path = require('path');
const fs = require('fs');

// ─── Configuration ───────────────────────────────────────────────────────────

/**
 * Resolve the Canvas 7 Files source directory.
 * Override via CLI flag: --canvas-src="E:/my/canvas/Canvas 7 Files"
 */
const CANVAS_SRC = (function ()
{
	const flag = process.argv.find(a => a.startsWith('--canvas-src='));
	if (flag) return flag.split('=').slice(1).join('=');
	return path.resolve(
		__dirname,
		'../../Purchased Software/themeforest-k0KRh5qD-canvas-the-multipurpose-html5-template/Package-HTML/Canvas 7 Files'
	);
}());

const PATHS = {
	// Source
	scss: 'css/default.scss',
	scssWatch: 'css/**/*.scss',
	js: 'js/default.js',
	jsWatch: 'js/**/*.js',
	html: 'index.html',
	images: 'images/**',
	vendor: 'vendor/**',

	// Output
	cssDev: 'css/',          // compiled CSS lands here during dev
	dist: 'dist/',
};

// ─────────────────────────────────────────────────────────────────────────────
// 1.  VENDOR SETUP  (gulp setup — run once after cloning)
//     Copies the minimum Canvas assets into ./vendor/
// ─────────────────────────────────────────────────────────────────────────────

function checkCanvasSrc(done)
{
	if (!fs.existsSync(CANVAS_SRC))
	{
		console.error(
			'\n[canvas-html] ERROR: Canvas source not found at:\n  ' + CANVAS_SRC +
			'\n\nProvide the correct path with:\n  gulp setup --canvas-src="path/to/Canvas 7 Files"\n'
		);
		process.exit(1);
	}
	done();
}

function copyVendorCoreCSS()
{
	return src(path.join(CANVAS_SRC, 'style.css'))
		.pipe(dest('vendor/'));
}

function copyVendorPluginCSS()
{
	return src([
		path.join(CANVAS_SRC, 'css/font-icons.css'),
		path.join(CANVAS_SRC, 'css/swiper.css'),
	]).pipe(dest('vendor/css/'));
}

function copyVendorFontIcons()
{
	return src(path.join(CANVAS_SRC, 'css/icons/**'), {encoding: false})
		.pipe(dest('vendor/css/icons/'));
}

function copyVendorWebFonts()
{
	return src(path.join(CANVAS_SRC, 'css/fonts/**'), {encoding: false})
		.pipe(dest('vendor/css/fonts/'));
}

function copyVendorJS()
{
	return src([
		path.join(CANVAS_SRC, 'js/plugins.min.js'),
		path.join(CANVAS_SRC, 'js/functions.bundle.js'),
	]).pipe(dest('vendor/js/'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  SCSS  →  css/default.css   (development, with source map)
// ─────────────────────────────────────────────────────────────────────────────

function compileSCSS()
{
	return src(PATHS.scss)
		.pipe(sourcemaps.init())
		.pipe(
			sass({outputStyle: 'expanded'})
				.on('error', sass.logError)
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(PATHS.cssDev))
		.pipe(browserSync.stream());
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  BUILD  →  dist/   (minified, production-ready)
// ─────────────────────────────────────────────────────────────────────────────

function buildCSS()
{
	return src('css/default.css')
		.pipe(cleanCSS({level: {1: {specialComments: 0}, 2: {}}}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(PATHS.dist + 'css/'));
}

function buildJS()
{
	return src(PATHS.js)
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(PATHS.dist + 'js/'));
}

function buildHTML()
{
	return src(PATHS.html)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			minifyCSS: true,
			minifyJS: {compress: {drop_console: true}},
		}))
		// Rewrite asset paths: dev paths → dist-friendly paths
		.pipe(require('gulp-replace')('href="css/default.css"', 'href="css/default.min.css"'))
		.pipe(require('gulp-replace')('src="js/default.js"', 'src="js/default.min.js"'))
		.pipe(dest(PATHS.dist));
}

function buildVendor()
{
	return src(PATHS.vendor, {encoding: false})
		.pipe(dest(PATHS.dist + 'vendor/'));
}

function buildImages()
{
	return src(PATHS.images, {encoding: false})
		.pipe(dest(PATHS.dist + 'images/'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  DEV SERVER  (BrowserSync + watch)
// ─────────────────────────────────────────────────────────────────────────────

function serve(done)
{
	browserSync.init({
		server: {
			baseDir: './',
		},
		port: 3000,
		open: true,
		notify: false,
		ghostMode: false,
		logPrefix: 'canvas-html',
	});

	// SCSS  → recompile & inject CSS without a full reload
	gulp.watch(PATHS.scssWatch, compileSCSS);

	// JS changes → full reload
	gulp.watch(PATHS.jsWatch).on('change', browserSync.reload);

	// HTML changes → full reload
	gulp.watch(PATHS.html).on('change', browserSync.reload);

	done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5.  CLEAN  (delete dist/)
// ─────────────────────────────────────────────────────────────────────────────

function clean(done)
{
	fs.rmSync(PATHS.dist, {recursive: true, force: true});
	console.log('[canvas-html] dist/ removed.');
	done();
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Tasks
// ─────────────────────────────────────────────────────────────────────────────

// gulp setup           Copy Canvas vendor assets into ./vendor (run after cloning)
exports.setup = series(
	checkCanvasSrc,
	parallel(
		copyVendorCoreCSS,
		copyVendorPluginCSS,
		copyVendorFontIcons,
		copyVendorWebFonts,
		copyVendorJS
	)
);

// gulp scss            Compile SCSS once
exports.scss = compileSCSS;

// gulp serve           Start dev server (assumes scss already compiled)
exports.serve = series(compileSCSS, serve);

// gulp build           Full production build → dist/
exports.build = series(
	compileSCSS,
	parallel(buildCSS, buildJS, buildVendor, buildImages),
	buildHTML
);

// gulp clean           Remove dist/
exports.clean = clean;

// gulp (default)       Compile SCSS then launch live dev server
exports.default = series(compileSCSS, serve);
