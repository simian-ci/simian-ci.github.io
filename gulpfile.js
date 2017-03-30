var gulp = require('gulp'),
    purify = require('gulp-purifycss');

var paths = {
  css: './_site/css/',
  html: './_site/**/*.html'
};

var mainCSS = paths.css + 'main.css';

gulp.task('purify-css', function() {
  return gulp.src(mainCSS)
    .pipe(purify([paths.html]))
    .pipe(gulp.dest(paths.css));
});

gulp.task('watch', function() {
  gulp.watch(mainCSS, ['purify-css']);
});

gulp.task('default', ['watch', 'purify-css']);
