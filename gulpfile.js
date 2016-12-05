var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  del = require('del');

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('font', function () {
  return gulp.src([
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('lint', function () {
  return gulp.src(['src/*.js'])
    .pipe(eslint('.eslintrc.json'))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('js', ['lint', 'clean'], function () {
  return gulp.src(['src/*.js'])
    .pipe(babel(
      {presets: ['es2015']}
    ))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/orgchart.min.js'));
});