# Simian CI - Jekyll Landing Page

This is the landing page for Simian CI.

## How to use

1. Make sure you have bundler installed (gem install bundler)
2. `bundle install`
3. `rbenv rehash`
4. `yarn install` to install npm dependencies
5. `jekyll serve --watch` to serve and watch for changes
6. `yarn run gulp` to purify the css (More on this below)
7. run `jekyll build` when you want to build the site

## SASS

Jekyll compiles SASS when serving/building. Put your partials in the `_sass` folder, and your `main.scss` file in `css` folder. Your `main.scss` file should have the front matter declaration (dashes at the top of the file) to work correctly.

We are using PurifyCSS to remove unused style rules, we made a gulp task for it, to start the watcher run:

`yarn run gulp` or `npm run gulp`

_Make sure you run `jekyll serve` at least once before running any gulp task, as they depend on the files that are on the _site folder_

# About

![hash labs logo](https://www.hashlabs.com/images/hashlabs_logo_horizontal_02.png)

Simian CI is maintained by [Hash Labs LLC](http://www.hashlabs.com)
