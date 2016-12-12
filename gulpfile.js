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
  del = require('del');

var paths = {
  js: 'src/*.js',
  css: 'src/*.css'
};

gulp.task('cleanCSS', function() {
  return del(['build/css']);
});
gulp.task('cleanJS', function() {
  return del(['build/js']);
});

gulp.task('font', function () {
  return gulp.src([
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('csslint', function() {
  gulp.src('src/*.css')
    .pipe(csslint({
      'adjoining-classes': false,
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
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
});

gulp.task('build', ['css', 'js', 'watch']);

gulp.task('webpack', ['build'], function () {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
  });
});

gulp.task('serve', ['webpack'], function () {
  browserSync.init({
    files: ['demo/**/*.html', 'demo/**/*.css'],
    server: 'demo',
    socket: {
      domain: 'localhost:3000'
    }
  });

  gulp.watch(['demo/**/*.js', '!demo//**/bundle*.js']).on('change', function(file) {
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
            test: /\.js$/,
            exclude: /node_modules/,
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