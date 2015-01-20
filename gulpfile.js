var gulp = require('gulp')
var jshint = require('gulp-jshint')

gulp.task('lint', function () {
  return gulp.src([
    'controller.js',
    'index.js',
    'gulpfile.js',
    'test/**/*.js',
    'example/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')))
  .pipe(jshint.reporter('fail'))
})

gulp.task('default', ['lint'])
