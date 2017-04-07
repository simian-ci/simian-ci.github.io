var gulp = require('gulp'),
    purify = require('gulp-purifycss'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant');;

var paths = {
  css: './_site/css/',
  mainCSS: './_site/css/main.css',
  html: './_site/**/*.html',
  mainJS: './_scripts/main.js',
  jsDest: './js/',
  jsProduction: './_site/js',
  images: './images/*',
  imagesDest: './images/'
};

gulp.task('css', function() {
  return gulp.src(paths.mainCSS)
    .pipe(purify([paths.html, paths.mainJS]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css));
});

gulp.task('js', function() {
  return gulp.src(paths.mainJS)
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(gulp.dest(paths.jsProduction));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin([
      imageminPngquant({
        quality: '75-85'
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(paths.imagesDest))
});

gulp.task('watch', function() {
  gulp.watch(paths.mainCSS, ['css']);
  gulp.watch(paths.mainJS, ['js']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch', 'css', 'js', 'images']);
