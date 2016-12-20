var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename"),
  csslint = require('gulp-csslint'),
  browserSync = require('browser-sync').create(),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  path = require('path'),
  del = require('del'),
  merge = require('merge-stream'),
  plumber = require('gulp-plumber');

gulp.task('cleanCSS', function() {
  return del(['build/css']);
});
gulp.task('cleanJS', function() {
  return del(['build/js']);
});

gulp.task('csslint', function() {
  gulp.src('src/*.css')
    .pipe(csslint({
      'adjoining-classes': false,
      'box-sizing': false,
      'box-model': false,
      'fallback-colors': false,
      'order-alphabetical': false
    }))
    .pipe(csslint.formatter());
});

gulp.task('css', ['csslint', 'cleanCSS'], function() {
  return gulp.src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename('orgchart.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('demo/css'));
});

gulp.task('eslint', function () {
  return gulp.src(['src/*.js'])
    .pipe(eslint('.eslintrc.json'))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('js', ['eslint', 'cleanJS'], function () {
  return gulp.src(['src/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel(
      {presets: ['es2015']}
    ))
    .pipe(uglify())
    .pipe(rename('orgchart.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.dest('demo/js'));
});

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.css', ['css']);
});

gulp.task('copyVendorAssets', function() {
  var fontawesomeCSS = gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('demo/css/vendor'));

  var fontawesomeFonts = gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('demo/css/fonts'));

  var html2canvas = gulp.src('node_modules/html2canvas/dist/html2canvas.min.js')
    .pipe(gulp.dest('demo/js/vendor'));

  return merge(fontawesomeCSS, fontawesomeFonts, html2canvas);
});

gulp.task('build', ['css', 'js', 'watch']);

gulp.task('webpack', ['build'], function () {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString());
  });
});

gulp.task('serve', ['copyVendorAssets', 'webpack'], function () {
  browserSync.init({
    files: ['src/*.css', 'demo/**/*.html', 'demo/**/*.css', '!demo/css/vendor/*.css'],
    server: 'demo',
    socket: {
      domain: 'localhost:3000'
    }
  });

  gulp.watch('src/*.js', ['webpack']);

  gulp.watch('demo/js/*').on('change', browserSync.reload);

  gulp.watch(['demo/**/*.js', '!demo/js/*', '!demo/js/vendor/*', '!demo/**/bundle*.js']).on('change', function(file) {
    webpack({
      entry: file.path,
      output: {
        path: path.dirname(file.path),
        filename: 'bundle.js'
      },
      devtool: 'source-map',
      module: {
        loaders: [
          {
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }, function(err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack', err);
      }
      browserSync.reload();
    });
  });

});