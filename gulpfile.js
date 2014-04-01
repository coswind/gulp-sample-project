var pkg = require('./package.json');
var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var concat = require('gulp-concat');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var git = require('gulp-git');

gulp.task('default', function() {
});

gulp.task('template', function() {
    gulp.src('templates/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build/layout'));
});

// Js concat, uglify.
gulp.task('js', function() {
    gulp.src(['src/js/*.js', 'src/js/**/*.js'])
        .pipe(concat(pkg.name + '.js'))
        .pipe(size())
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
        .pipe(size())
        .pipe(gulp.dest('dist/styles'))
        .pipe(autoprefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(minifyCSS())
        .pipe(rename(pkg.name + '.min.css'))
        .pipe(size())
        .pipe(gulp.dest('dist/styles'));
});

// Tag.
gulp.task('tag', function() {
    var version = 'v' + pkg.version;
    var message = 'Release ' + version;

    gulp.src('./')
        .pipe(git.commit(message))
        .pipe(git.tag(version, message))
        .pipe(git.push('origin', 'master', '--tags'))
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['js', 'css'], function() {

});

var cssWatcher = gulp.watch(['src/styles/**'], ['css']);
cssWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks....');
});

var jsWatcher = gulp.watch(['src/js/**'], ['js']);
jsWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks....');
});
