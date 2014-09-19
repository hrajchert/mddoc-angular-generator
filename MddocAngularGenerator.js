var gulp           = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    filter         = require('gulp-filter'),
    concat         = require('gulp-concat'),
    prefix         = require('gulp-autoprefixer'),
    replace        = require('gulp-replace'),
    merge          = require('merge-stream'),
    _              = require('lodash'),

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

var streamToPromise = function (s) {
    return when.promise(function(resolve, reject) {
        s.on('end',resolve);
        s.on('error', reject);
    });
};








function getAbsolutePath(dir) {
    dir = path.normalize(dir);
    if (dir[0] !== '/') {
        dir = path.join(process.cwd(), dir);
    }
    return dir;
}

module.exports = function (PluginResolver) {
    var BaseGenerator = PluginResolver.BaseGenerator;

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

    // Extend from the base generator
    _.extend(MddocAngularGenerator.prototype, BaseGenerator.prototype);

    MddocAngularGenerator.prototype.generate = function (h) {
        helper = h;
        helper.settings = generatorSettings;
//        return when.promise(function(resolve, reject) {
        console.log('generating the mddoc angular');
        var tasks = [
            this._angular_generator_lib_js(),
            this._compile(),
            this._theme_css(),
            this._vendor_css_files(),
            this._project_js(),
            this._main_js()
        ];
        return when.all(tasks);
//            gulp.start('compile','main.js','angular-generator-lib.js',
//                       'vendor-css-files','project.js','theme-css', function(err) {
//                if (err) {
//                    return reject(err);
//                }
//                resolve();
//            });
//        });
    };

    MddocAngularGenerator.prototype._compile = function () {
        var files = merge(
            gulp.src('./public/**/*.tpl', {cwd: __dirname}),
            gulp.src(overrideDir.tpl + '/**/*.tpl', {cwd: __dirname})

        );
        var pipeline = files
            .pipe(log('Rendering %s'))
            .pipe(renderTemplate({renderer: renderer, helpers: helper}))
            .pipe(gulp.dest(dest));

        return streamToPromise(pipeline);
    };

    MddocAngularGenerator.prototype._theme_css = function () {
        var pipeline = gulp.src('./themes/sticky-footer-navbar.css', {cwd: __dirname})
            .pipe(concat('theme.css'))
            .pipe(prefix('last 2 version'))
            .pipe(gulp.dest(dest + '/css/'));
        return streamToPromise(pipeline);
    };

    MddocAngularGenerator.prototype._vendor_css_files =  function() {
        var files = merge(
                gulp.src('./public/**/*.css', {cwd: __dirname}),
                // TODO: maybe create another task
                gulp.src(overrideDir.css + '/**/*.css', {cwd: __dirname}),
                gulp.src(mainBowerFiles({paths: __dirname}),{cwd: __dirname})
                    .pipe(filter('**/*.css'))

        );

        var pipeline = files
            .pipe(log('main.css: %s'))
            .pipe(concat('main.css'))
            .pipe(prefix('last 2 version'))

    //        .pipe(uglify())
            .pipe(gulp.dest(dest + '/css/'));

        return streamToPromise(pipeline);

    };

    MddocAngularGenerator.prototype._angular_generator_lib_js = function() {
        var files = merge(
            gulp.src(mainBowerFiles({paths: __dirname}),{cwd: __dirname})
                .pipe(filter('**/*.js')),
            gulp.src('./public/vendor/**/*.js', {cwd: __dirname})
        );

        var pipeline = files
            .pipe(concat('angular-generator-lib.js'))
    //        .pipe(uglify())
            .pipe(gulp.dest(dest + '/js/vendor/'));
        return streamToPromise(pipeline);
    };



    MddocAngularGenerator.prototype._project_js = function() {

        var pipeline = gulp.src(overrideDir.js + '/**/*.js', {cwd: __dirname})
    //        .pipe(log())
            .pipe(concat('project.js'))
    //        .pipe(uglify())
            .pipe(gulp.dest(dest + '/js/'));
        return streamToPromise(pipeline);
    };


    MddocAngularGenerator.prototype._main_js = function() {
        var moduleString = '"' + generatorSettings.modules.join('","') + '"';
        var pipeline = gulp.src(['./public/js/main.js', './public/js/**/*.js'], {cwd: __dirname})
            .pipe(replace('/*--ANGULAR-GENERATOR-DEPENDENCIES--*/', moduleString))
            .pipe(concat('main.js'))
    //        .pipe(uglify())
            .pipe(gulp.dest(dest + '/js/'));
        return streamToPromise(pipeline);
    };

    return {
        createGenerator: function (metadata, settings) {
            return new MddocAngularGenerator(metadata, settings);
        }
    };
};

