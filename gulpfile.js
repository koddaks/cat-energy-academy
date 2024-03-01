import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import csso from "postcss-csso";
import rename from "gulp-rename";
import autoprefixer from "autoprefixer";
import squoosh from "gulp-libsquoosh";
import svgmin from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import browser from "browser-sync";
import htmlmin from "gulp-htmlmin";
import terser from "gulp-terser";
import { deleteAsync as del } from "del";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

const copyStyles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// Scripts

const scripts = () => {
  return gulp.src(["source/js/*.js", "!source/js/check-overflow-content.js"]).pipe(terser()).pipe(gulp.dest("build/js"));
};

// Images

const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const copyImages = () => {
  // return gulp.src("source/img/**/*.{jpg,png,svg}").pipe(gulp.dest("build/img"));
  return gulp.src("source/img/**/*.{jpg,png}").pipe(gulp.dest("build/img"));
};

// WebP

const createWebP = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh({ webp: {} }))
    .pipe(gulp.dest("build/img"));
};

// SVG

const svg = () => {
  return gulp
    .src(["source/img/**/*.svg", "!source/img/sprite/*.svg"])
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"));
};

const sprite = () => {
  return gulp
    .src(["source/img/sprite/*.svg", "!source/img/icons/*.svg"])
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy

const copy = (done) => {
  return gulp
    .src(
      ["source/fonts/*.{woff2,woff}", "source/*.ico", "source/*.webmanifest"],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", html);
  gulp.watch("source/js/*.js").on("change", gulp.series(scripts, browser.reload));
  gulp.watch("source/*.html").on("change", browser.reload);
};

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(styles, html, scripts, svg, sprite)
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, scripts, svg, sprite),
  gulp.series(server, watcher)
);
