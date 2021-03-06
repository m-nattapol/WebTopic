let gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    babel       = require('gulp-babel'),
    reload      = browserSync.reload

gulp.task('default', ['browserSync', 'jsWatch'], () => {
    gulp.watch([
        'public/**/**.html',
        'public/stylesheets/**.css'
    ]).on('change', reload)

    gulp.watch('public/javascripts/**.js', ['jsWatch'])
})

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: "127.0.0.1:3000"
    })
})

gulp.task('jsWatch', ['jsCompile'], () => {
    browserSync.reload();
})

gulp.task('jsCompile', () => {
    gulp.src([
        'public/javascripts/app.js',
        'public/javascripts/service.js',
        'public/javascripts/controller.js',
        'public/javascripts/directive.js'
    ])
    .pipe(concat('app.js'))
    .pipe(babel({presets:['es2015']}))
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('public/javascripts/dist'))
})
