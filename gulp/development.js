var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var commonGulp = require('./common');
var gutil = require('gulp-util');
var through = require('through');

gulp.task('csslint', ['clean','bower-less'], function () {
    return gulp.src(['public/css/**/*.css','build/less/**/*.css'])
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.reporter())
        .pipe(count('csslint', 'files lint free'));
});

gulp.task('jshint', ['jsx','typescript'], function() {
    return gulp.src(['public/js/**/*.js', 'build/jsx/**/*.js', 'build/ts/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(count('jshint', 'files lint free'));
});

gulp.task('js-development', ['jshint'], function() {
    return gulp.src(['public/js/**/*.js'], {base:'public/js'})
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('jsx-development',['jshint'], function() {
    return gulp.src(['build/jsx/**/*.js'], {base: 'build/jsx'})
        .pipe(gulp.dest('dist/public/jsx'));
});

gulp.task('css-development', ['csslint'], function() {
    return gulp.src(['public/css/**/*.css'], {base: 'public/css'})
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('ts-development', ['jshint'], function() {
    return gulp.src(['build/ts/**/*.js'], {base: 'build/ts'})
        .pipe(gulp.dest('dist/'));
});

gulp.task('css-vendor-development', ['csslint'], function() {
    return gulp.src(commonGulp.css)
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('less-vendor-development', ['csslint'], function() {
    return gulp.src(['build/less/**/*.css'])
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('js-vendor-development', ['jshint'], function() {
    return gulp.src(commonGulp.js)
        .pipe(gulp.dest('dist/public/js-vendor'));
});

gulp.task('jade-development', ['js-vendor-development', 'js-development', 'jsx-development', 'css-development', 'css-vendor-development'], commonGulp.jadeExecute);

gulp.task('build-development',['js-development','jsx-development', 'css-development', 'ts-development', 'css-vendor-development', 'js-vendor-development', 'less-vendor-development','package-json','jade-development'], function() {});

gulp.task('devServe', ['build-development'], function () {
    plugins.nodemon({
        script: 'dist/app.js',
        ext: 'html js',
        env: { 'NODE_ENV': 'development' } ,
        ignore: ['node_modules/'],
        nodeArgs: ['--debug']
    });
});

gulp.task('watch', ['build-development'], function () {
    gulp.watch(['public/js/**/*.js'], ['build-development']).on('change', plugins.livereload.changed);
    gulp.watch(['views/**/*.jade'], ['build-development']).on('change', plugins.livereload.changed);
    gulp.watch(['public/css/**/*.css'], ['build-development']).on('change', plugins.livereload.changed);
    gulp.watch(['public/jsx/**/*.jsx'], ['build-development']).on('change', plugins.livereload.changed);
    gulp.watch(['**/*.ts','!node_modules/**','!bower_components/**'], ['build-development']).on('change', plugins.livereload.changed);
    plugins.livereload.listen({interval: 500});
});

gulp.task('dev', ['watch', 'devServe'], function(){});

function count(taskName, message) {
    var fileCount = 0;

    function countFiles(file) {
        fileCount++; // jshint ignore:line
    }

    function endStream() {
        gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
        this.emit('end'); // jshint ignore:line
    }
    return through(countFiles, endStream);
}
