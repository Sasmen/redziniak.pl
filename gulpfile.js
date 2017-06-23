const gulp = require('gulp'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      prefix = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      runSequence = require('run-sequence'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      htmlreplace = require('gulp-html-replace'),
      htmlmin = require('gulp-htmlmin'),
      sass = require('gulp-sass'),
      prettyError = require('gulp-prettyerror'),
      svgstore = require('gulp-svgstore'),
      rename = require('gulp-rename'),
      svgmin = require('gulp-svgmin'),
      spritesmith = require('gulp.spritesmith'),
      htmlImport = require('gulp-html-import'),
      sourcemaps = require('gulp-sourcemaps'),
      tap = require('gulp-tap'),
      path = require('path'),
      newfile = require('gulp-file'),
      babel = require('gulp-babel'),
      sassImportOnce = require('gulp-sass-import-once');

const paths = {
   html: 'src/*.html',
   sass: 'src/css/style.scss',
   img: 'src/img/*',
   imgSamples: 'src/img/samples/*',
   scripts: ['src/js/plugins/*.js', 'src/js/*.js'],
   vendors: 'src/js/vendor/**/*.js',
   cssLib: 'src/css/lib/*.css',
   svg: 'src/img/*.svg',
   svgSprites: 'src/img/sprites/*.svg',
   pngSprites: 'src/img/sprites/*.png',
   videos: 'src/video/*',
   fonts: 'src/fonts/*',
   componentsFolder: 'src/components/',
   build: 'build/**/*',
   toZip: 'build/**/*'
};

let indexTemplate = `<!doctype html>
<html class="no-js" lang="">
   @import "head.html"
   <body>
   @import "header.html"
   @import "footer.html"
   </body>
</html>`;

let footerTemplate = `<footer>

FOOTER
</footer>

<!-- build:js-lib -->
<!-- endbuild -->

<!-- build:js -->
<!-- endbuild -->
`;

let headTemplate = `
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Strona</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#fff">

    <link href="https://fonts.googleapis.com/css?family=Titillium+Web:300,400,600&amp;subset=latin-ext" rel="stylesheet">

    <!-- build:css-lib -->
    <!-- endbuild -->

    <!-- build:css -->
    <!-- endbuild -->

</head>
`;

let headerTemplate = `<nav>MENU</nav>`;
gulp.task('clean', function () {
   return del(['build']);
});

gulp.task('js-lib', function () {
   gulp.src(paths.vendors)
         .pipe(sourcemaps.init())
         .pipe(uglify())
         .pipe(concat('js-lib.min.js'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/js/lib'));
});

gulp.task('js-lib-min', function () {
   gulp.src(paths.vendors)
         .pipe(uglify())
         .pipe(concat('js-lib.min.js'))
         .pipe(gulp.dest('build/js/lib'));
});

gulp.task('css-lib', function () {
   gulp.src(paths.cssLib)
         .pipe(sourcemaps.init())
         .pipe(concat('css-lib.min.css'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/css/lib'));
});

gulp.task('css-lib-min', function () {
   gulp.src(paths.cssLib)
         .pipe(concat('css-lib.min.css'))
         .pipe(cleanCSS({compatibility: 'ie8'}))
         .pipe(gulp.dest('build/css/lib'));
});

gulp.task('script', function () {
   return gulp.src(paths.scripts)
         .pipe(prettyError())
      
         .pipe(sourcemaps.init())
         .pipe(babel({
            presets: ['es2015']
         }))
         .pipe(uglify())
         .pipe(concat('script.min.js'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/js'));
});

gulp.task('script-min', function () {
   return gulp.src(paths.scripts)
         .pipe(babel({
            presets: ['es2015']
         }))
         .pipe(uglify())
         .pipe(concat('script.min.js'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/js'));
});

gulp.task('script-dev', function () {
   return gulp.src(paths.scripts)
         .pipe(prettyError())
         .pipe(concat('script.js'))
         .pipe(gulp.dest('build/js'))
         .pipe(uglify())
         .pipe(concat('script.min.js'))
         .pipe(gulp.dest('build/js'));
});

gulp.task('copyVideo', function () {
   return gulp.src(paths.videos)
         .pipe(gulp.dest('build/video'));
});

gulp.task('sass', function () {
   return gulp.src(paths.sass)
         .pipe(sourcemaps.init())
         .pipe(prettyError())
         .pipe(sass({
            outputStyle: 'compressed'
         }.on))
         .pipe(prefix('> 5%'))
         .pipe(concat('style.min.css'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/css'));
});

gulp.task('sass-min', function () {
   return gulp.src(paths.sass)
         .pipe(prettyError())
         .pipe(sass({outputStyle: 'compressed'}.on))
         .pipe(prefix('> 5%'))
         .pipe(concat('style.min.css'))
         .pipe(cleanCSS({compatibility: 'ie8'}))
         .pipe(gulp.dest('build/css'));
});

gulp.task('sass-dev', function () {
   return gulp.src(paths.sass)
         .pipe(prettyError())
         .pipe(sass())
         .pipe(prefix('> 5%'))
         .pipe(concat('style.css'))
         .pipe(gulp.dest('build/css'))
         .pipe(concat('style.min.css'))
         .pipe(cleanCSS({compatibility: 'ie9'}))
         .pipe(gulp.dest('build/css'));
});

gulp.task('img', function () {
   gulp.src(paths.img)
         .pipe(imagemin())
         .pipe(gulp.dest('build/img'));
});
gulp.task('imgSamples', function () {
   gulp.src(paths.imgSamples)
         .pipe(imagemin())
         .pipe(gulp.dest('build/img/samples'));
});

gulp.task('html', function () {
   return gulp.src(paths.html)
         .pipe(prettyError())
         .pipe(htmlImport(paths.componentsFolder))
         .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'css-lib': 'css/lib/css-lib.min.css',
            'css-sprite': 'css/sprite.css',
            'js': 'js/script.min.js',
            'js-lib': 'js/lib/js-lib.min.js'
         }))
         .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
         .pipe(gulp.dest('build'));
});

gulp.task('html-min', function () {
   return gulp.src(paths.html)
         .pipe(prettyError())
         .pipe(htmlImport(paths.componentsFolder))
         .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'css-lib': 'css/lib/css-lib.min.css',
            'css-sprite': 'css/sprite.css',
            'js': 'js/script.min.js',
            'js-lib': 'js/lib/js-lib.min.js'
         }))
         .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
         .pipe(gulp.dest('build'));
});

gulp.task('html-dev', function () {
   return gulp.src(paths.html)
         .pipe(prettyError())
         .pipe(htmlImport(paths.componentsFolder))
         .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'css-lib': 'css/lib/css-lib.min.css',
            'css-sprite': 'css/sprite.css',
            'js': 'js/script.min.js',
            'js-lib': 'js/lib/js-lib.min.js'
         }))
         .pipe(gulp.dest('build'));
});

gulp.task('import', function () {
   gulp.src(paths.html)
         .pipe(gulp.dest('dist'));
});

gulp.task('sprite-svg', function () {
   return gulp.src(paths.svgSprites)
         .pipe(svgstore())
         .pipe(svgmin({
            plugins: [{
               removeStyleElement: true
            }]
         }))
         .pipe(rename('svg-sprite.svg'))
         .pipe(gulp.dest('build/img/'));
});

gulp.task('sprite-png', function () {
   let spriteData = gulp.src('src/img/sprites/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
   }));
   return spriteData.pipe(gulp.dest('build/css/'));
});

gulp.task('copy-fonts', function () {
   gulp.src(paths.fonts)
         .pipe(gulp.dest('build/fonts'));
});

gulp.task('zip', function () {
   gulp.src(paths.toZip)
         .pipe(zip('archive.zip'))
         .pipe(gulp.dest(''));
});

gulp.task('createStructure', function () {
   gulp.src('')
         .pipe(tap(function () {
            return newfile('index.html', indexTemplate).pipe(gulp.dest('src'));
         }))
         .pipe(tap(function () {
            return newfile('head.html', headTemplate).pipe(gulp.dest('src/components'));
         }))
         .pipe(tap(function () {
            return newfile('header.html', headerTemplate).pipe(gulp.dest('src/components'));
         }))
         .pipe(tap(function () {
            return newfile('footer.html', footerTemplate).pipe(gulp.dest('src/components'));
         }))
         .pipe(tap(function () {
            return newfile('style.scss', `body {padding:0;}`).pipe(gulp.dest('src/css'));
         }))
         .pipe(tap(function () {
            return newfile('script.js', ``).pipe(gulp.dest('src/js'));
         }))
         .pipe(tap(function () {
            return newfile('plugin.js', ``).pipe(gulp.dest('src/js/vendor/plugins'));
         }));
});

gulp.task('build', function (callback) {
   require('events').EventEmitter.prototype._maxListeners = 100;
   runSequence('clean', ['sass', 'script', 'sprite-png', 'css-lib', 'js-lib', 'img', 'html', 'sprite-svg', 'imgSamples', 'copyVideo', 'copy-fonts'],
         callback
   );
});

gulp.task('fast-build', function (callback) {
   runSequence('sass', ['script', 'html'],
         callback
   );
});

gulp.task('default', function (callback) {
});

gulp.task('watch', function () {
   gulp.watch('src/**/*', ['fast-build']);
});

gulp.task('build-dev', function (callback) {
   require('events').EventEmitter.prototype._maxListeners = 100;
   runSequence('clean', ['sass-dev', 'script-dev', 'sprite-png', 'css-lib-min', 'js-lib-min', 'img', 'html-dev', 'sprite-svg', 'imgSamples', 'copyVideo', 'copy-fonts'],
         callback
   );
});
gulp.task('build-min', function (callback) {
   require('events').EventEmitter.prototype._maxListeners = 100;
   runSequence('clean', ['sass-min', 'script-min', 'sprite-png', 'css-lib-min', 'js-lib-min', 'img', 'html-min', 'sprite-svg', 'imgSamples', 'copyVideo', 'copy-fonts'],
         callback
   );
});