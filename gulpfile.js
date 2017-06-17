'use strict';

const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const runSequence = require('run-sequence')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const jpegRecompress = require('imagemin-jpeg-recompress')
const ngAnnotate = require('gulp-ng-annotate')
const changed = require('gulp-changed')
const notify = require("gulp-notify")
const replace = require('gulp-replace')
const rev = require('gulp-rev')
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const nodemon = require('gulp-nodemon')
const babel = require('gulp-babel')

gulp.task('clean', () => {
  return gulp.src('./dist/')
    .pipe(clean())
})

gulp.task('compile-sass', () => {
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed'
  }
  return gulp.src('./css/**/style.scss')
    .pipe(sass(sassOptions)).on('error', notify.onError((error) => {
        console.log('\n//////////////////////////////\n\n' + error.messageFormatted + '\n\n//////////////////////////////\n\n')
        return '\nSass não foi compilado.\nOlhe no terminal o erro.\n'
    }))
    .pipe(autoprefixer({
        browsers: ['last 7 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
    // .pipe(notify('Sass compilado com sucesso!'))
})

gulp.task('copyFonts', () => {
  return gulp.src('./css/fonts/*')
    .pipe(gulp.dest('./dist/css/fonts'))
})

gulp.task('optimize-img', () => {
  return gulp.src(['./img/**/*.png', './img/**/*.svg', './img/**/*.gif'])
    .pipe(changed('./dist/img'))
    .pipe(imagemin({
        use: [pngquant(), jpegRecompress({progressive: true})]
    }))
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream())
    .pipe(notify({message: 'Imagens otimizadas com sucesso', onLast: true}))
})

gulp.task('copy-jpeg-img', () => {
  return gulp.src('./img/**/*.jpg')
    .pipe(gulp.dest('./dist/img'))
})

gulp.task('uglify-libs', () => {
  return gulp.src('./lib/**/*.js')
    .pipe(changed('./dist/js'))
    .pipe(uglify())
    .pipe(concat('compressed.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
    .pipe(notify('Bibliotecas compiladas com sucesso'))
})

gulp.task('uglify-scripts', () => {
  return gulp.src('./js/**/*.js')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({
      presets: ['es2015']
     }))
    .pipe(changed('./dist/js'))
    .pipe(ngAnnotate())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
})

gulp.task('watchAndUpdate', () => {
  gulp.watch('./css/**/*.scss', ['compile-sass'])
  gulp.watch('./js/**/*.js', ['uglify-scripts'])
  gulp.watch('./lib/**/*.js', ['uglify-libs'])
  gulp.watch('./img/**/*', ['optimize-img'])
  gulp.watch('./index.html').on('change', browserSync.reload);
  gulp.watch('./views/*.html').on('change', browserSync.reload);
})

gulp.task('prod', (callback) => {
  return runSequence('clean', ['uglify-libs', 'uglify-scripts', 'compile-sass', 'copyFonts', 'optimize-img', 'copy-jpeg-img'], callback)
})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
        baseDir: "./"
    },
    watchOptions: {
      ignoreInitial: true,
      ignored: 'node_modules'
    }
  });
});

gulp.task('watch', (callback) => {
  return runSequence('compile-sass', 'uglify-scripts', 'uglify-libs', 'optimize-img', 'copy-jpeg-img', 'browser-sync', ['watchAndUpdate'], callback)
})

var onError = function(err)
{
  console.log('\n//////////////////////////////\n\n' + err.toString() + '\n\n//////////////////////////////\n\n');
}
