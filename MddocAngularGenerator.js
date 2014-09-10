var gulp           = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    filter         = require('gulp-filter'),
    concat         = require('gulp-concat'),
    prefix         = require('gulp-autoprefixer'),
    merge          = require('merge-stream'),


//    uglify         = require('gulp-uglify'),
    when           = require('when'),
    ECT            = require('ect');


var renderTemplate = require('./src/renderTemplate'),
    log            = require('./src/log.js');

var path = require('path');

var dest;
var renderer;
var helper;
var generatorSettings;
var overrideDir;

gulp.task('project.js', function() {

    return gulp.src(overrideDir.js + '/**/*.js', {cwd: __dirname})
//        .pipe(log())
        .pipe(concat('project.js'))
//        .pipe(uglify())
        .pipe(gulp.dest(dest + '/js/'));
});


gulp.task('main.js', function() {
    return gulp.src('./public/js/**/*.js', {cwd: __dirname})
        .pipe(concat('main.js'))
//        .pipe(uglify())
        .pipe(gulp.dest(dest + '/js/'));
});


gulp.task('vendor-js-files', function() {
    var files = merge(
        gulp.src(mainBowerFiles({paths: __dirname}),{cwd: __dirname})
            .pipe(filter('**/*.js')),
        gulp.src('./public/vendor/**/*.js', {cwd: __dirname})
    );

    return files
        .pipe(log('lib.js: %s'))

        .pipe(concat('lib.js'))
//        .pipe(uglify())
        .pipe(gulp.dest(dest + '/js/vendor/'));
});

gulp.task('vendor-css-files', function() {
    var files = merge(
            gulp.src('./public/**/*.css', {cwd: __dirname}),
            // TODO: maybe create another task
            gulp.src(overrideDir.css + '/**/*.css', {cwd: __dirname}),
            gulp.src(mainBowerFiles({paths: __dirname}),{cwd: __dirname})
                .pipe(filter('**/*.css'))

    );

    return files
        .pipe(log('main.css: %s'))
        .pipe(concat('main.css'))
        .pipe(prefix('last 2 version'))

//        .pipe(uglify())
        .pipe(gulp.dest(dest + '/css/'));
});

gulp.task('theme-css', function() {
    return gulp.src('./themes/sticky-footer-navbar.css', {cwd: __dirname})
        .pipe(concat('theme.css'))
        .pipe(prefix('last 2 version'))
        .pipe(gulp.dest(dest + '/css/'));


});


gulp.task('compile', function() {
    var files = merge(
        gulp.src('./public/**/*.tpl', {cwd: __dirname}),
        gulp.src(overrideDir.tpl + '/**/*.tpl', {cwd: __dirname})

    );
    return files
        .pipe(log('Rendering %s'))
        .pipe(renderTemplate({renderer: renderer, helpers: helper}))
        .pipe(gulp.dest(dest));
});


function getAbsolutePath(dir) {
    dir = path.normalize(dir);
    if (dir[0] !== '/') {
        dir = path.join(process.cwd(), dir);
    }
    return dir;
}

var MddocAngularGenerator = function (metadata, settings) {
    this.settings = settings;

    // TODO: if dest is not absolute add __dirname as the relative path
    dest = this.settings.outputDir;

    // mhmh no me gusta el cableo de nombre
    generatorSettings = this.settings.generators['mddoc-angular-generator'];

    if (!generatorSettings.hasOwnProperty('modules')) {
        generatorSettings.modules = [];
    }
//    generatorSettings.modules.push('ngRoute');
    generatorSettings.modules.push('ui.bootstrap');

    var defaultOverrideDir = getAbsolutePath(settings.inputDir) + '/mddoc-angular-generator';
    // TODO: change name and add a way to change it from the conf
    overrideDir = {
        js:  defaultOverrideDir,
        css: defaultOverrideDir,
        tpl: defaultOverrideDir
    };
    renderer = ECT({ root : __dirname + '/public/' });
};

MddocAngularGenerator.prototype.generate = function (h) {
    helper = h;
    helper.settings = generatorSettings;
    return when.promise(function(resolve, reject) {
        console.log('generating the mddoc angular');
        gulp.start('compile','main.js','vendor-js-files', 'vendor-css-files','project.js','theme-css', function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });

    });
//    debugger;

};

exports.constructor = function (metadata, settings) {
    return new MddocAngularGenerator(metadata, settings);
};

