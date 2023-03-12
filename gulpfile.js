"use strict"

const {src, dest} = require('gulp');

const gulp = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const removeComments = require("gulp-strip-css-comments");
const uglify = require("gulp-uglify");
const del = require("del");
const sass = require('gulp-sass')(require('sass'));
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

/* paths*/

const srcPath = "src/";
const distPath = "dist/";

const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css",
        js: distPath + "assets/js",
        media: distPath + "assets/media",
        fonts: distPath  + "assets/fonts"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        media: srcPath + "assets/media/**/*.(jpg,png,svg,ico,webp)",
        fonts: srcPath  + "assets/fonts/**/*.(ttf,eot,woff,woff2)"
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/scss/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        media: srcPath + "assets/media/**/*.(jpg,png,svg,ico,webp)",
        fonts: srcPath  + "assets/fonts/**/*.(ttf,eot,woff,woff2)"
    },
    clean: './' + distPath
};
function serve() {
    browserSync.init({
        server: {
            baseDir: './' + distPath
        }
    });
};
function html() {
    return src(path.src.html, { base: srcPath})
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}))
};
function css() {
    return src(path.src.css, { base: srcPath + "assets/scss/"})
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))
};
function js() {
    return src(path.src.js, { base: srcPath + "assets/js/"})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
};
function clean() {
    return del(path.clean)
};
function media() {
    return src(path.src.media, { base: srcPath + "assets/media/"})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 50, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(path.build.media))
        .pipe(browserSync.reload({stream: true}))
};
function fonts() {
    return src(path.src.fonts, { base: srcPath + "assets/fonts/"})
        .pipe(browserSync.reload({stream: true}))
};

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.media], media)
    gulp.watch([path.watch.fonts], fonts)
};

const build = gulp.series(clean, gulp.parallel(html, css, js, media, fonts));
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.media = media;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;