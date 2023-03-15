# gulp file / gulp boilerplate / gulp script / gulp starter

- gulp 4 (file / script / boilerplate) for building and developing website applications using static html markup , css styles , javascript , images and fonts.
- you will have a demo prject, and 2 installation guides avilable, the first one is a quick one to get you up and running fast, and another one with detailed explaination to understand as much as you can.

# features

## global features

- easy/simple to use, configure and maintain.
- easy src and execlude certain files or folders from the pipe proccess.
- watch for any file change, save, move, rename or delete.
- **instant reload on any file change**, and allows access from external devices **(mobiles/tablets)**, using [browser-sync](https://www.npmjs.com/package/browser-sync).
- logging errors in (console/terminal/cmd) to make it easy to fix.
- works on all operating systems like (windows, macOS, linux).
- providing two environments, **dev_env** for development and **prod_env** to be the final optimized and minified version.
- step by step installation guide that will help you get started quickly and also(if you want) learn about gulp in the way.

## image features

- optimizing images reducing its size without affecting its quality, and there are 2 ways to do this and you can choose either one you like =>

1. first way is => optimize (png, jpg, jpeg, gif) images using [gulp-image](https://www.npmjs.com/package/gulp-image). this package do a great job optimizing images and reducing there size without affecting its quality.
2. second way is => convert all (png, jpg, jpeg, gif) images to ".webp" extension that is much smaller with almost same quality. [webP](https://developers.google.com/speed/webp) - [webp-sampels](https://developers.google.com/speed/webp/gallery1)

## HTML features

- common component file include like (header, footer, ...etc).
- base directory for any paths(images, style-files, html-pages, ..etc), no need to write "../../" before any path.
- based on the base directory paths we now can have multiple folder level for html pages structure if needed, without having any issues with (routing/file paths), find the example below =>

- auto detect each html file name then name the browser tab after it, by putting it into the &lt;title> tag of each page.

## CSS / SASS features

- compiling **SASS**.
- auto-prefixing for a predefined browser list.
- source maps only on **dev_env**.
- minify and optimize css files.

## javascript features

- minify, optimize and concatinate js files.

# getting started => installation

- install Node.js 16.16.0 or higher =>
  - [download](https://nodejs.org/en/)
  - or [use-nvm](https://dev.to/skaytech/how-to-install-node-version-manager-nvm-for-windows-10-4nbi) if you need more than node version
- `npm install gulp --location=global` => install gulp globally
- `npm install` => install node_modules
- `gulp` => for development environment
- `gulp prod` for final production folder




# to do next time

- adding fonts features
- build a small project for demo.
- add multiple level structure to demonstrate the html feature.
