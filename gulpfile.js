let gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    reload      = browserSync.reload

gulp.task('default', ['browserSync'], () => {
    gulp.watch([
        'app.js',
        'routes/**.js'
    ]).on('change', reload)
})

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: "127.0.0.1:3000"
    })
})
