pkg = require './package.json'
gulp = require 'gulp'
clean = require 'gulp-clean'
jshint = require 'gulp-jshint'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
size = require 'gulp-size'
concat = require 'gulp-concat'
autoprefixer = require 'gulp-autoprefixer'
minifyCSS = require 'gulp-minify-css'
changed = require 'gulp-changed'
browserify = require 'gulp-browserify'

gulp.task 'clean', ->
    gulp.src 'dist', { read: false }
        .pipe clean()

gulp.task 'lint', ->
    gulp.src 'src/js/**'
        .pipe jshint()

gulp.task 'coffee', ['lint'], ->
    gulp.src 'src/coffee/app.coffee', { read: false }
        .pipe (browserify {
                insertGlobals: true,
                transform: ['coffeeify'],
                extensions: ['.coffee']
            })
        .pipe (rename 'app.min.js')
        .pipe uglify()
        .pipe size()
        .pipe (gulp.dest 'dist/js')

gulp.task 'css', ->
    gulp.src 'src/css/**'
        .pipe (concat pkg.name + '.css')
        .pipe (gulp.dest 'dist/css')
        .pipe (autoprefixer "last 1 version", "> 1%", "ie 8", "ie 7")
        .pipe minifyCSS()
        .pipe (rename pkg.name + '.min.css')
        .pipe size()
        .pipe (gulp.dest 'dist/css')


gulp.task 'watch', ->
    gulp.watch 'src/coffee/**', ['coffee']
    # gulp.watch 'src/css/**', ['css']

gulp.task 'default', ['watch']

gulp.task 'build', ['js', 'css']
