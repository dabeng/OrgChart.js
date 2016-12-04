const gulp = require('gulp');

gulp.task('font', () => {
  return gulp.src([
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});