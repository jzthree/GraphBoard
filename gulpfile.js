/* Copyright 2015 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

var gulp = require('gulp');
var server = require('gulp-server-livereload');
var minimist = require('minimist');
var util = require('./gulp_tasks/util');
var typedoc = require("gulp-typedoc");
var shell = require('gulp-shell')


var options = minimist(process.argv.slice(2), {
  default: {
    p: 8001,  // port for gulp server
    h: 'localhost', // host to serve on
  }
});

function getTask(task) {
    return require('./gulp_tasks/' + task);
}


gulp.task('compile', getTask('compile')(true));
gulp.task('first-compile', getTask('compile')(true));
gulp.task('compile-without-deps', getTask('compile')(false));
gulp.task('test.onlytest', getTask('test'));
gulp.task('test', ['compile'], getTask('test'));

gulp.task('watch', [], function() {
  // Avoid watching generated .d.ts in the build (aka output) directory.
  return gulp.watch(
      ['components/tf_*/**/*.ts', 'components/vz_*/**/*.ts'],
      {ignoreInitial: true}, ['compile']);
});

var httpPrefix = 'http://' + options.h + ':' + options.p + '/components';
var proxies = util.tbComponents.map(function(component) {
  return {
    source: '/components' + component.replace(/_/g, '-'),
    target: httpPrefix + component
  };
});

// Do first-compile before turning on server, to avoid spamming
// livereload info
// TODO(danmane): Disconnect this once we can get livereload to
// no longer spam.
gulp.task('server', ['first-compile'], function() {
  gulp.src('.').pipe(server({
    host: options.h,
    port: options.p,
    livereload: {
      enable: false,
      // Don't livereload on .ts changes, since they aren't loaded by browser.
      filter: function(filePath, cb) { cb(!(/\.ts$/.test(filePath))); },
      port: 27729 + options.p
    },
    proxies: proxies,
    directoryListing: true,
  }));
});

// TODO(danmane): When testing is nicer, integrate into vulcanize task
// gulp vulcanize: Regenerate the tf-tensorboard.html.OPENSOURCE file for pre-release
gulp.task(
    'vulcanize', ['compile-without-deps'],
    getTask('vulcanize')(false));
// gulp regenerate: Regenerate the tf-tensorboard.html for interactive bazel development
gulp.task(
    'regenerate', ['compile-without-deps'],
    getTask('vulcanize')(true));

// TODO(danmane): consider making bower install part of default task
gulp.task('default', ['watch', 'server']);

// Clean all compiled JS files.
var cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');
gulp.task('clean', function () {
  return gulp.src(['./components/**/*.ts', '!./components/**/deps.d.ts'])
      .pipe(cleanCompiledTypeScript());
});

function emptyfile(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
}

gulp.task("typedoc_", function() {
    return gulp
        .src(["./components/tf_graph_common/lib/*.ts","./components/tf_graph_common/lib/scene/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es6",
            out: "./docs/",
            name: "GraphBoard/tf_graph_common",
            ignoreCompilerErrors: true,
            includeDeclarations: true,
            excludeExternals: true,
        }))
    ;
});

gulp.task('typedoc',['typedoc_'], shell.task([
  'touch ./docs/.nojekyll ',
]))
