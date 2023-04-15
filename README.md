# gulp file / gulp boilerplate / gulp script / gulp starter

- gulp 4 (file / script / boilerplate) for building and developing website applications using html, css, javascript, images and fonts.
- you will have a demo prject, and 2 installation guides avilable, the first one is a quick one to get you up and running fast, and another one with detailed explaination to understand as much as you can.

# features

## global features

- easy/simple to use, configure and maintain.
- easy sourc and execlude certain files or folders from the pipe proccess.
- watch for any file change, save, move, rename or delete.
- **instant reload on any file change**, and generate access for external devices **(mobiles/tablets/other PCs)**, using [browser-sync](https://www.npmjs.com/package/browser-sync).
- logging errors in (console/terminal/cmd) making it easy to fix.
- providing two environments, **dev_env** for development and **prod_env** to be the final optimized and minified version.
- works on all operating systems like (windows, macOS, linux).
- step by step installation guide that will help you get started quickly and also(if you want) learn about gulp in the way.

## image features

- optimizing images reducing its size without affecting its quality.

## HTML features

- html component include like (header, footer, navbar, ...etc) with passed arguments and if statments.
- base directory for any paths(images, style-files, html-pages, ..etc), no need to write "../../" before any path.
- based on the base directory paths we now can have multiple folder level for html pages structure if needed, without having any issues with (routing/file paths), see the example below =>
  ```bash
  📦app
  ┣ 📂pages
  ┃ ┣ 📜404.html
  ┃ ┣ 📜team.html
  ┃ ┗ 📜testimonial.html
  ┣ 📜about.html
  ┣ 📜contact.html
  ┣ 📜index.html
  ┣ 📜LICENSE.txt
  ┣ 📜project.html
  ┣ 📜READ-ME.txt
  ┣ 📜seo-agency-website-template.jpg
  ┗ 📜service.html
  ```
- auto name html page in the browser tab after the file naming

## CSS / SASS features

- compiling **SASS**.
- auto-prefixing for a predefined browser list.
- source maps only on **dev_env**, then remove it on **prod_env**.
- purge-css => remove unused styles from any internal or external style files.
- minify and optimize css files.
- generate both beautified and minified versions of css on production,

## javascript features

- minify, optimize and concatinate js files.

# getting started => installation

- first clone this repo or [download](https://github.com/Mohamed-Talaat333/gulp-boilerplate/archive/refs/heads/master.zip).
- install Node.js `16.16.0` or higher =>
  - check your node version if it is already installed `node -v`
  - [download](https://nodejs.org/en/).
  - or [use-nvm](https://dev.to/skaytech/how-to-install-node-version-manager-nvm-for-windows-10-4nbi) if you need more than node version.
- `npm install gulp --location=global` => install gulp globally.
- `npm install` => install node_modules.
- `gulp` => for development environment.
- `gulp prod` for final production folder.
- after you like, don't forget the star.

# step by step guide

- here we will be explaining each gulp task.

## setting output directory dev or prod env environments

```
var outputDir = "dist"; // folder where all files and folders go after compiling
var isProd = false; // setting production env to false

// or

// run when gulp-prod
function setProdEnv(done) {
  outputDir = "prod";
  isProd = true; // setting production env to true
  done();
}
```

## setting source paths for gulp tasks

- using file path wild card patterns and execlude array for certain files to be execluded from stream pipe.

```
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
```

## remove old folders

- remove old (dist && prod) directories then start over, **in case files got deleted or renamed while not watching**

```
function removeOldFolders() {
  return remove(outputDir, { force: true });
}
```

## init browser-sync

- [browser-sync](https://www.npmjs.com/package/browser-sync) is responsible for live server providing **instant reload on any file change**, and generate access for external devices **(mobiles/tablets/other PCs)**.

```
function browser_sync() {
  browserSync({
    server: {
      baseDir: `${outputDir}/`, // folder where the server    starts from
    },
    options: {
      reloadDelay: 250, // time between file save and reload
    },
    notify: false,
  });
}

// command line output while running
[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.1.104:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 --------------------------------------
[Browsersync] Serving files from: dist/
```

## handling images

- this task is mainly for optimizing images and there are 2 ways to do this and you can choose either one you like =>

1. first way is => optimize (png, jpg, jpeg, gif) images using [gulp-image](https://www.npmjs.com/package/gulp-image). this package do a great job optimizing images and reducing there size without affecting its quality.
2. second way is => convert all (png, jpg, jpeg, gif) images to ".webp" extension that is much smaller with almost same quality. [webP](https://developers.google.com/speed/webp) - [webp-sampels](https://developers.google.com/speed/webp/gallery1)

```
function images() {
  return (
    src(paths.images.src)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // optimizing images => commented
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
```

## handling HTML files

- using [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) we now can include html files into another html files passing arguments and using conditional if statements => see the (page-head, page-tail, and navbar active-link) file examples.

```
.pipe(
  fileinclude({
    prefix: "@@",
    basepath: "app/html-partials",
  })
)
```

- using [gulp-flatmap](https://www.npmjs.com/package/gulp-flatmap) we now can seperate each file from the src stream and do anything we want with it, and I mainly used it to do 2 things

  1. using `$$/` sign before any rout, we can have base directory starting from `app/`.

     - for example in `app/html-partials/page-head.html` page in style links routs also the favicon.
       ```
       <link href="$$/assets/styles/style.css" rel="stylesheet" />
       ```

  2. replace the title for each html file with the file name to view it on browser window tab.

- in html-task we need to replace all of the image-extensions in the style file other than `.svg && .ico` to be webp and match the prechanged image-extensions in the images-task

```
// replacing all images extensions to be '.webp'
  .pipe(gulpIf(isProd, replace('.jpg', '.webp')))
  .pipe(gulpIf(isProd, replace('.jpeg', '.webp')))
  .pipe(gulpIf(isProd, replace('.png', '.webp')))
  .pipe(gulpIf(isProd, replace('.gif', '.webp')))
```

## handling style files

- other than compiling sass, wrting sourcemaps, css autoprefixing, and minifying => the best feature is purging-css.

- using [gulp-purgecss](https://www.npmjs.com/package/gulp-purgecss) removes all unused css styles based on class-names used in html files as a reference. => see the difference between normal and minified bootstrap files-size after `gulp-prod` in prod-folder

  ```
  // removing unused css
    .pipe(
      gulpIf(
        isProd,
        purgeCss({
          content: [paths.html.src],
        })
      )
    )
  ```

  - `in some casses the html-code appended by an internal or external js plugin doesn't get counted for when style-purging and it removes it's styles.`

  - `in order for this purgecss package to work fine, you should copy the html-code that gets rendered in the browser and add it to an html page to get considered by gulp-purgecss, see (purge-css-components.html)=>(owl-carousel-component).`

- then we minify css files and add suffix `-min`

```
// minifying our css file/s only if in production environment
  .pipe(gulpIf(isProd, cleanCSS()))

// renaming by adding -min
  .pipe(gulpIf(isProd, rename({ suffix: "-min" })))
```

- after renaming minified css files adding `-min` suffix, we need to change the linking in html by adding an if statement ([gulp-file-include](https://www.npmjs.com/package/gulp-file-include)) to the link-href:

```
// we add this after the file name
@@if(isProd){-min}

<link href="$$/assets/styles/style@@if(isProd){-min}.css" rel="stylesheet" />
```

# to do

- searching fonts features
- svg sprites

# License
- The code is available under the [MIT License](https://github.com/Mohamed-Talaat333/gulp-boilerplate/blob/master/LICENSE.md).