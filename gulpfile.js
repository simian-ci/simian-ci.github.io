var gulp = require('gulp'),
    purify = require('gulp-purifycss'),
    cleanCSS = require('gulp-clean-css');

var paths = {
  css: './_site/css/',
  html: './_site/**/*.html'
};

var mainCSS = paths.css + 'main.css';

gulp.task('css', function() {
  return gulp.src(mainCSS)
    .pipe(purify([paths.html]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css));
});

gulp.task('watch', function() {
  gulp.watch(mainCSS, ['css']);
});

gulp.task('default', ['watch', 'css']);
