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

_Make sure you run `jekyll serve` at least once, as this creates or updates the _site and it's needed to deploy and for some gulp tasks folder_

## SASS

Jekyll compiles SASS when serving/building. Put your partials in the `_sass` folder, and your `main.scss` file in `css` folder. Your `main.scss` file should have the front matter declaration (dashes at the top of the file) to work correctly.

We are using PurifyCSS to remove unused style rules, we made a gulp task for it, to start the watcher run:

`yarn run gulp` or `npm run gulp`

## Firebase

We are using firebase as the staging site hosting, to deploy the site make sure to login first with `firebase login`.

- To serve with firebase run: `firebase serve` (This does not generate any files, just host the files on the `_site` folder, but it's useful to preview before deploying)
- To deploy to firebase, run:`firebase deploy`
>>>>>>> 7b1f289... Added firebase config for staging site

# About

![hash labs logo](https://www.hashlabs.com/images/hashlabs_logo_horizontal_02.png)

Simian CI is maintained by [Hash Labs LLC](http://www.hashlabs.com)
