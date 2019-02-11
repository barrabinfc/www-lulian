import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssPreset from "postcss-preset-env";
import svgInline from "postcss-inline-svg";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();
const hugoBin = "hugo";
const defaultArgs = ["-d", "../docs",
  "-s", "site",
  "-v",];

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

gulp.task("build", ["css", "vendor-js", "js", "copy", "hugo"]);
gulp.task("build-preview", ["css", "vendor-js", "js", "copy", "hugo-preview"]);

gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssImport({ from: "./src/css/main.css" }),
      svgInline(),
      cssPreset({ stage: 0 }),
    ]))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./docs/css"))
    .pipe(browserSync.stream())
));

gulp.task("vendor-js", () => {
  gulp.src("./src/js/vendor/*.js")
    .pipe(gulp.dest("./docs/js/vendor"))
})

/** 
 * Copy necessary assets to root
 */
gulp.task("copy", () => {
  gulp.src("./src/static/**/*")
    .pipe(gulp.dest("./docs"))
})

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task("server", ["hugo", "css", "vendor-js", "js"], () => {
  browserSync.init({
    server: {
      baseDir: './docs'
    }
  })
  gulp.watch("./src/js/vendor/*.js", ["vendor-js"]);
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, { stdio: "inherit" }).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
