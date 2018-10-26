const gulp        = require('gulp');
const scss        = require('gulp-sass');
const plumber     = require('gulp-plumber');
const sourcemaps  = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const cleanCSS    = require('gulp-clean-css');
const concat      = require('gulp-concat');
const babel       = require('gulp-babel');
const runSequence = require('run-sequence');

function handleError (error) {
    console.log(error.toString());
    this.emit('end');
}

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
        "./node_modules/autosize/dist/autosize.js",
        "./node_modules/twemoji/2/twemoji.js",
        "./src/javascript/lib/*.js",
        "./src/javascript/mode/*.js",
        "./config/client_info.js",
        "./config/default_config.js",
        "./src/javascript/tooterminal.js",
        ])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', handleError)
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-scss', function(){
    return gulp.src([
        './src/style/*.scss',
        ])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(scss({
            includePaths: ['./node_modules/@fortawesome/fontawesome-free/scss']
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(concat('style.css'))
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

gulp.task('webfonts', function() {
    return gulp.src([
        './node_modules/@fortawesome/fontawesome-free/webfonts/*',
        './node_modules/source-code-pro/*/SourceCodePro-Regular*',
        './node_modules/source-code-pro/*/*/SourceCodePro-Regular*',
        ])
        .pipe(gulp.dest('./dist/webfonts'));
});

gulp.task('scss-watch', ['minify-scss','browser-sync'], function(){
    gulp.watch("./dist/*.html",['bs-reload']);
    gulp.watch(["./src/style/*.scss", "./src/style/*/*.scss"], function() {
        return runSequence(
            'minify-scss',
            'bs-reload'
        );
    });
    gulp.watch(["./src/javascript/*.js", "./src/javascript/*/*.js"],function() {
        return runSequence(
            'minify-js',
            'bs-reload'
        );
    });
});

gulp.task('default', function() {
    return runSequence(
        ['build'],
        ['scss-watch','browser-sync']
    )
});
gulp.task('build',['minify-scss', 'minify-js', 'webfonts']);
