var gulp = require('gulp');
var del = require('del');
var wiredep = require('wiredep');
var plugins = require('gulp-load-plugins')();

gulp.task('help', plugins.taskListing);

gulp.task('clean', function (cb) {
  return del(['dist/', 'build/'], cb);
});

gulp.task('jsx', ['clean'], function() {
    return gulp.src(['./public/jsx/**/*.jsx'])
        .pipe(plugins.react())
        .pipe(gulp.dest('build/jsx'));
});

gulp.task('typescript', ['clean'], function() {
    var tsProject = plugins.typescript.createProject('tsconfig.json');
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(plugins.typescript(tsProject));

    return tsResult.js.pipe(gulp.dest('build/ts'));
});

gulp.task('bower-less', ['clean'], function() {
    return gulp.src(wiredep().less || [])
        .pipe(plugins.less())
        .pipe(gulp.dest('build/less'));
});

gulp.task('package-json', ['clean'], function() {
    return gulp.src(['package.json'])
        .pipe(gulp.dest('dist'));
});

var jadeExecute = function() {
    return gulp.src(['views/**/*.jade'], {base:'views'})
        .pipe(wiredep.stream({
            fileTypes: {
                jade: {
                    replace: {
                        js: function (filePath) {
                            return 'script(src="../js-vendor/' + filePath.split('/').pop() + '")';
                        }
                    }
                }
            }
        }))
        .pipe(plugins.inject(
            gulp.src(['dist/public/css/**/*.css','dist/public/js/**/*.js'], {read:false, base:'dist/public'}),
            {
                name:'header',
                addPrefix: '..',
                ignorePath: '../dist/public',
                relative: true
            }
        ))
        .pipe(plugins.inject(
            gulp.src(['dist/public/jsx/**/*.js'], {read:false, base:'dist/public/jsx'}),
            {
                name:'react',
                addPrefix: '..',
                ignorePath: '../dist/public',
                relative: true
            }
        ))
        .pipe(gulp.dest('dist/views'));
};

module.exports = {css:wiredep().css || [], js:wiredep().js || [], jadeExecute:jadeExecute};
