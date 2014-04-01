var pkg = require('./package.json');
var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var concat = require('gulp-concat');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var changed = require('gulp-changed');

gulp.task('template', function() {
    gulp.src('templates/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build/layout'));
});

gulp.task('clean', function() {
    gulp.src('dist/', { read: false })
        .pipe(clean());
});

gulp.task('lint', function() {
    gulp.src('src/js/**')
        .pipe(jshint());
});

// Js concat, uglify.
gulp.task('js', function() {
    gulp.src(['src/js/*.js', 'src/js/**/*.js'])
        .pipe(concat(pkg.name + '.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('dist/js'));
});

// CSS concat, auto-prefix and minify.
gulp.task('css', function() {
    gulp.src(['src/styles/*.css'])
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(autoprefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(minifyCSS())
        .pipe(rename(pkg.name + '.min.css'))
        .pipe(size())
        .pipe(gulp.dest('dist/styles'));
});

// Watcher.
gulp.task('watch', function() {
    gulp.watch(['src/styles/**'], ['css']);
    gulp.watch(['src/js/**'], ['js']);
});

gulp.task('default', ['js', 'css', 'watch']);
