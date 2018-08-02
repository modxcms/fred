'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import del from 'del';
import pkg from './package.json';
import webpackConfig from "./webpack.config.js";
import merge from "merge-stream";
import concat from "gulp-concat";

import sass from 'gulp-ruby-sass';
import sassInlineSvg from 'gulp-sass-inline-svg';
import svgmin from 'gulp-svgmin';

import log from 'fancy-log';

const $ = gulpLoadPlugins();
const libFolder = './_build/assets/lib';
const sources = './_build/assets/js/**/*.js';

gulp.task('default', ['build-web']);

// Build for web
gulp.task('build-web', ['webpack:build-web', 'css']);

// Build for web + watch
gulp.task('build-web-dev', ['webpack:build-web-dev', 'css'], () => {
    gulp.watch([sources], ['webpack:build-web-dev']);
    gulp.watch(['./_build/assets/sass/**/*.scss'], ['css']);
});

gulp.task('css', function() {
    var sassStream = sass('./_build/assets/sass/fred.scss', {
        style: 'compressed',
        loadPath: [
            './_build/assets/sass'
        ]
    });
    
    var cssStream = gulp.src([
        './node_modules/flatpickr/dist/flatpickr.min.css',
        './node_modules/nouislider/distribute/nouislider.min.css'
    ]);
    
    return merge(sassStream,cssStream)
        .pipe(concat('fred.css'))
        .pipe(gulp.dest('./assets/components/fred/web'));
});

gulp.task('sass:svg', function(){
    return gulp.src('./_build/assets/images/**/*.svg')
        .pipe(svgmin()) // Recommend using svg min to optimize svg files first
        .pipe(sassInlineSvg({
            destDir: './_build/assets/sass/'
        }));
});

// Run Babel only
gulp.task('build-babel', ['clean'], () =>
    gulp.src([sources])
        .pipe($.babel())
        // Output files
        .pipe(gulp.dest(libFolder))
);

// Clean folder
gulp.task('clean', () =>
    del([`${libFolder}/**/*`])
);

// Webpack helper
gulp.task('webpack:build-web', done => {
    var env = {'BUILD_ENV': 'PROD', 'TARGET_ENV': 'WEB'};
    var taskName = 'webpack:build-web';
    // run webpack
    webpack(webpackConfig(env), onBuild(done, taskName));
});

// Webpack watch helper
// create a single instance of the compiler to allow caching
var webDevCompiler = null;
gulp.task('webpack:build-web-dev', done => {
    var env = {'BUILD_ENV': 'DEV', 'TARGET_ENV': 'WEB'};
    var taskName = 'webpack:build-web-dev';
    // build dev compiler
    if (!webDevCompiler) {
        webDevCompiler = webpack(webpackConfig(env));
    }
    // run webpack
    webDevCompiler.run(onBuild(done, taskName));
});

function onBuild(done, taskName) {
    return (err, stats) => {
        if (err)
            throw new gutil.PluginError(taskName, err);
        log(`${taskName}`, stats.toString({colors: true}));
        done && done();
    }
}

// Sets environment variable
function setEnv(buildEnv) {
    $.env({
        vars: {
            BUILD_ENV: buildEnv
        }
    });
}