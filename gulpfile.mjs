import gulp from "gulp";
const { src, dest, task, watch, series, parallel } = gulp;

import browserSync from "browser-sync"; // live server
import minifyJs from "gulp-minify"; // for javascript files minification
import dartSass from "sass"; // for sass compilation
import gulpSass from "gulp-sass"; // for sass compilation
const sass = gulpSass(dartSass); // for sass compilation
import sourceMaps from "gulp-sourcemaps"; // for css files sourcemaps after sass compilation
import cleanCSS from "gulp-clean-css"; // for css files minification
import autoPrefixer from "gulp-autoprefixer"; // for css auto prefixing
import purgeCss from "gulp-purgecss"; // remove unused styles from any internal or external css files
import plumber from "gulp-plumber"; // prevent pipe breaking caused by errors from gulp plugins
import fileinclude from "gulp-file-include"; // for including html files
import remove from "del"; // for file deletion
import gulpIf from "gulp-if"; // control the pipe flow with if statement
import flatMap from "gulp-flatmap"; // map each file in a stream into multiple files that are piped out
import replace from "gulp-replace"; // replace certain text
// import imageOpti from "gulp-image";
import webp from "gulp-webp"; // convert images extensions to ".webp"
import rename from "gulp-rename"; // for files renaming
// import concat from "gulp-concat"; // for files concating

/*******************************************
    Settings
*******************************************/

var outputDir = "dist"; // folder where all files and folders go after compiling
var isProd = false; // setting production env to false
var imageExtensions = [".jpeg", ".jpg", ".png", ".gif"];

// or

// run when gulp-prod
function setProdEnv(done) {
  outputDir = "prod";
  isProd = true; // setting production env to true
  done();
}

// path to files where you watch and start your task process
var paths = {
  // images paths
  images: {
    src: "app/**/*.{ico,jpeg,jpg,png,gif,webp}",
  },

  // font files paths
  fonts: {
    src: "app/**/*.{eot,svg,ttf,woff,woff2}",
  },

  // html file paths
  html: {
    src: "app/**/*.html",
    execlud: ["app/html-partials{,/**}"],
  },

  // sass or css file paths
  customStyles: {
    src: "app/**/*.{scss,css}",
    execlud: ["app/**/_*", "app/assets/styles/sass{,/**}", "app/assets/styles/vendors/**/*"],
  },

  vendorStyles: {
    src: "app/**/*.{scss,css}",
    execlud: ["app/assets/styles/sass{,/**}", "app/assets/styles/style{.css,.scss}"],
  },

  // js files paths
  scripts: {
    src: "app/**/*.js",
    execlud: [],
  },
};

/*******************************************
    Gulp tasks
*******************************************/

/* remove old (dist && prod) directories then start over, in case files got deleted or renamed while not watching
 *******************************************/
function removeOldFolders() {
  return remove(outputDir, { force: true });
}

/* initializing browser-sync server
 *******************************************/
function browser_sync() {
  browserSync({
    server: {
      baseDir: `${outputDir}/`, // folder where the server starts from
    },
    options: {
      reloadDelay: 250, // time between file save and reload
    },
    notify: false,
  });
}

/* handling images
 *******************************************/
function images() {
  return (
    src(paths.images.src)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // optimizing images
      // .pipe(gulpIf(isProd, imageOpti()))

      // converting to '.webp' to lower the size with almost same quality
      .pipe(gulpIf(isProd, webp()))

      // destination for the output
      .pipe(dest(outputDir))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

/* handling fonts
 *******************************************/
function fonts() {
  return (
    src(paths.fonts.src)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // Destination for the output
      .pipe(dest(outputDir))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

/* handling HTML files
 *******************************************/
function html() {
  return (
    src([
      paths.html.src,
      ...paths.html.execlud.map(function (item) {
        return "!" + item;
      }),
    ])
      // prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // handling all HTML includes
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "app/html-partials",
          context: {
            isProd: isProd,
          },
        })
      )

      .pipe(
        flatMap(function (stream, file) {
          // if codition > detecting operating system to determine whether to use forwardslash or backslash
          if (process.platform == "win32") {
            // repeating "../" based on the arcticture level of the file to replace with ($$) sign
            var route = "../".repeat(
              (file.path.split("app\\").pop().match(/\\/g) || []).length
            );

            // getting file name to preview it into tab <title> tag.
            var fileName = file.path
              .slice(file.path.lastIndexOf("\\") + 1)
              .replace(".html", "");
          } else {
            // repeating "../" based on the arcticture level of the file to replace with ($$) sign
            var route = "../".repeat(
              (file.path.split("app/").pop().match(/\//g) || []).length
            );

            // getting file name to preview it into tab <title> tag.
            var fileName = file.path
              .slice(file.path.lastIndexOf("/") + 1)
              .replace(".html", "");
          }

          // contents.files is an array
          return stream
            .pipe(replace("$$/", route))
            .pipe(replace("<title></title>", `<title>${fileName}</title>`));
        })
      )

      // replacing all images extensions to be '.webp'
      .pipe(gulpIf(isProd, replace(".jpg", ".webp")))
      .pipe(gulpIf(isProd, replace(".jpeg", ".webp")))
      .pipe(gulpIf(isProd, replace(".png", ".webp")))
      .pipe(gulpIf(isProd, replace(".gif", ".webp")))

      // Destination for the output
      .pipe(dest(outputDir))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

/* handling style(sass) files
 *******************************************/
function styles(parameterPaths) {
  // the initializer / mastaer SCSS file, which will just be a file that imports everything
  return (
    src([
      parameterPaths.src,
      ...parameterPaths.execlud.map(function (item) {
        return "!" + item;
      }),
    ])

      // Detecting style file extenssion to write sourceMaps only if not css file (if sass file)
      // .pipe(flatMap(function(stream, file){
      //   var isExtenssionCss;
      //   file.path.split(".").pop() == "css" ? isExtenssionCss = true : isExtenssionCss = false;

      //   return stream

      //   // Getting sourceMaps ready only if in development environment
      //     .pipe(gulpIf(!isExtenssionCss && !isProd, sourceMaps.init()));
      // }))

      // Getting sourceMaps ready only if in development environment
      .pipe(gulpIf(!isProd, sourceMaps.init()))

      // Compiling SCSS files
      .pipe(sass())

      // Prefixing all styles to match cross browsers
      .pipe(
        autoPrefixer({
          cascade: true,
        })
      )

      // writing our sourceMaps only if in development environment
      .pipe(gulpIf(!isProd, sourceMaps.write("/")))

      // destination for the not minified output
      .pipe(dest(outputDir))

      // the final filename of our combined css file
      // .pipe(concat("style.css"))

      // removing unused css
      .pipe(
        gulpIf(
          isProd,
          purgeCss({
            content: [paths.html.src],
          })
        )
      )

      // replacing all images extensions to be '.webp'
      .pipe(gulpIf(isProd, replace(".jpg", ".webp")))
      .pipe(gulpIf(isProd, replace(".jpeg", ".webp")))
      .pipe(gulpIf(isProd, replace(".png", ".webp")))
      .pipe(gulpIf(isProd, replace(".gif", ".webp")))

      // minifying our css file/s only if in production environment
      .pipe(gulpIf(isProd, cleanCSS()))

      // renaming by adding -min
      .pipe(gulpIf(isProd, rename({ suffix: "-min" })))

      // destination for the minified output
      .pipe(gulpIf(isProd, dest(outputDir)))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

function customStyles(done) {
  styles(paths.customStyles);
  done();
}

function vendorStyles(done) {
  styles(paths.vendorStyles);
  done();
}

/* handling javascript files
 *******************************************/
function scripts() {
  // this is where our dev js are
  return (
    src([
      paths.scripts.src,
      ...paths.scripts.execlud.map(function (item) {
        return "!" + item;
      }),
    ])
      // prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // this is the filename of the compressed version of our js
      // .pipe(concat("app.js"))

      // destination for the output if dev-env or in prod-env before minification
      .pipe(dest(outputDir))

      // minifying our js file/s only if in production environment
      .pipe(
        gulpIf(
          isProd,
          minifyJs({
            ext: {
              src: ".js",
              min: ".js",
            },
            mangle: false,
            noSource: true,
            ignoreFiles: [".combo.js", ".min.js"],
          })
        )
      )

      // destination for the output if prod-env after minification
      .pipe(gulpIf(isProd, dest(outputDir)))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

/* main watch function, and (starting && reloading) browser using browser_sync
 *******************************************/
function watch_files() {
  // watching files for each function
  watch(paths.images.src, images);
  watch(paths.fonts.src, fonts);
  watch(paths.html.src, html);
  watch(paths.customStyles.src, customStyles);
  watch([paths.vendorStyles.src,
    ...paths.vendorStyles.execlud.map(function (item) {
      return "!" + item;
    })], vendorStyles);
  watch(paths.scripts.src, scripts);

  // handling (deleted && renamed) files or folders while watching/running
  const mainWatcher = watch("app/**/*");
  mainWatcher.on("all", function (event, path) {
    if (event == "unlink" || event == "unlinkDir") {
      if (process.platform == "win32") {
        var distPath = path.replace("app\\", `${outputDir}\\`);
      } else {
        var distPath = path.replace("app/", `${outputDir}/`);
      }
      remove(distPath, { force: true });
      console.log(`${path} was removed`);
      console.log(`${distPath} was removed`);
    }
  });

  // starting development server on browser
  browser_sync();
}

/*******************************************
    main gulp tasks
*******************************************/

task(
  "default",
  series(
    removeOldFolders,
    images,
    fonts,
    html,
    customStyles,
    vendorStyles,
    scripts,
    watch_files
  )
);

task(
  "prod",
  series(
    setProdEnv,
    removeOldFolders,
    images,
    fonts,
    html,
    customStyles,
    vendorStyles,
    scripts,
    function prodFinished(done) {
      console.log('Your final "prod" folder is ready');
      done();
    }
  )
);
