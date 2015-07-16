var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var commonGulp = require('./common');
var gutil = require('gulp-util');
var series = require('stream-series');
var through = require('through');

gulp.task('js-production', ['clean'], function() {
    return gulp.src(['public/js/**/*.js'], {base:'public/js'})
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('jsx-production',['jsx'], function() {
    var rootJsx = gulp.src(['build/jsx/*.js'], {base:'build/jsx'});
    var depJsx = gulp.src(['!build/jsx/*.js','build/jsx/**/*.js'], {base: 'build/jsx'});

    return series(depJsx, rootJsx)
        .pipe(plugins.concat('jsx.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/public/jsx'));
});

gulp.task('css-production', ['clean'], function() {
    return gulp.src(['public/css/**/*.css'], {base: 'public/css'})
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('smoo.min.css'))
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('ts-production', ['typescript'], function() {
    return gulp.src(['build/ts/**/*.js'], {base: 'build/ts'})
        .pipe(gulp.dest('dist/'));
});

gulp.task('css-vendor-production', ['clean'], function() {
    return gulp.src(commonGulp.css)
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('deps.min.css'))
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('less-vendor-production', ['bower-less'], function() {
    return gulp.src(['build/less/**/*.css'])
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('deps-less.min.css'))
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('js-vendor-production', ['clean'], function() {
    return gulp.src(commonGulp.js)
        .pipe(plugins.concat('deps.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/public/js-vendor'));
});

gulp.task('jade-production', ['js-vendor-production', 'js-production', 'jsx-production', 'css-production', 'css-vendor-production', 'less-vendor-production'], commonGulp.jadeExecute);

gulp.task('build-production',['js-production','jsx-production', 'css-production', 'ts-production', 'css-vendor-production', 'js-vendor-production', 'less-vendor-production','package-json','jade-production'], function() {});

gulp.task('prod', ['build-production'], function() {});

function count(taskName, message) {
    var fileCount = 0;

    function countFiles(file) {
        gutil.log(file);
        fileCount++; // jshint ignore:line
    }

    function endStream() {
        gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
        this.emit('end'); // jshint ignore:line
    }
    return through(countFiles, endStream);
}
