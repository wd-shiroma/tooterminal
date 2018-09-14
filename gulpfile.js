const gulp        = require('gulp');
const scss        = require('gulp-sass');
const plumber     = require('gulp-plumber');
const sourcemaps  = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const cleanCSS    = require('gulp-clean-css');
const concat      = require('gulp-concat');
const babel       = require('gulp-babel');
const runSequence = require('run-sequence');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
             baseDir: "./dist",
             index  : "index.html"
        },
        open: false
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('minify-js', function() {
    return gulp.src([
        "./node_modules/jquery/dist/jquery.js",
        "./node_modules/jquery.mousewheel/jquery.mousewheel.js",
        "./src/javascript/jquery.terminal_tooterminal.js",
        "./node_modules/autosize/src/autosize.js",
        "./node_modules/twemoji/2/twemoji.js",
        "./src/javascript/cisco_emulator.js",
        "./src/javascript/mode_global.js",
        "./src/javascript/mode_config.js",
        "./src/javascript/mode_instance.js",
        "./src/javascript/tooterminal.js",
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-scss', function(){
    return gulp.src('./src/style/*.scss')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minify-css', function() {
    return gulp.src("./src/style/*.css")
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('scss-watch', ['minify-scss','browser-sync'], function(){
    gulp.watch("./dist/*.html",['bs-reload']);
    gulp.watch("./src/style/*.scss", function() {
        return runSequence(
            'minify-scss',
            'bs-reload'
        );
    });
    gulp.watch("./src/javascript/*.js",function() {
        return runSequence(
            'minify-js',
            'bs-reload'
        );
    });
});

gulp.task('default', ['scss-watch','browser-sync']);
gulp.task('build',['minify-scss','minify-js']);
