/* Copyright 2015 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
var TF;
(function (TF) {
    var Backend;
    (function (Backend) {
        describe('urlPathHelpers', function () {
            var demoify = TF.Backend.demoify;
            var encode = TF.Backend.queryEncoder;
            it('demoify works as expected', function () {
                var demoified = demoify(Backend.BAD_CHARACTERS);
                var all_clean = '';
                for (var i = 0; i < Backend.BAD_CHARACTERS.length; i++) {
                    all_clean += '_';
                }
                chai.assert.equal(demoified, all_clean, 'cleaning the BAD_CHARACTERS works');
                chai.assert.equal(demoify('foozod'), 'foozod', 'doesnt change safe string');
                chai.assert.equal(demoify('foo zod (2)'), 'foo_zod__2_', 'simple case');
            });
            it('queryEncoder works with demoify on spaces and parens', function () {
                var params = { foo: 'something with spaces and (parens)' };
                var actual = demoify(encode(params));
                var expected = '_foo_something_with_spaces_and__28parens_29';
                chai.assert.equal(actual, expected);
            });
        });
        describe('backend tests', function () {
            var backend;
            var rm;
            var base = 'data';
            var demoRouter = TF.Backend.router(base, true);
            beforeEach(function () {
                // Construct a demo Backend (third param is true)
                backend = new Backend.Backend(demoRouter);
                rm = new Backend.RequestManager();
            });
            it('runs are loaded properly', function (done) {
                var runsResponse = backend.runs();
                var actualRuns = rm.request(demoRouter.runs());
                Promise.all([runsResponse, actualRuns]).then(function (values) {
                    chai.assert.deepEqual(values[0], values[1]);
                    done();
                });
            });
            it('all registered types have handlers', function () {
                Backend.TYPES.forEach(function (t) {
                    chai.assert.isDefined(backend[t], t);
                    chai.assert.isDefined(backend[t + 'Runs'], t + 'Runs');
                });
            });
            it('trailing slash removed from base route', function () {
                var r = TF.Backend.router('foo/');
                chai.assert.equal(r.runs(), 'foo/runs');
            });
            it('run helper methods work', function (done) {
                var scalar = { run1: ['cross_entropy (1)'], fake_run_no_data: ['scalar2'] };
                var image = { run1: ['im1'], fake_run_no_data: ['im1', 'im2'] };
                var audio = { run1: ['audio1'], fake_run_no_data: ['audio1', 'audio2'] };
                var runMetadata = { run1: ['step99'], fake_run_no_data: ['step99'] };
                var graph = ['fake_run_no_data'];
                var count = 0;
                function next() {
                    count++;
                    if (count === 4) {
                        done();
                    }
                }
                backend.graphRuns().then(function (x) {
                    chai.assert.deepEqual(x, graph);
                    next();
                });
            });
            it('runToTag helpers work', function () {
                var r2t = {
                    run1: ['foo', 'bar', 'zod'],
                    run2: ['zod', 'zoink'],
                    a: ['foo', 'zod']
                };
                var empty1 = {};
                var empty2 = { run1: [], run2: [] };
                chai.assert.deepEqual(Backend.getRuns(r2t), ['a', 'run1', 'run2']);
                chai.assert.deepEqual(Backend.getTags(r2t), ['bar', 'foo', 'zod', 'zoink']);
                chai.assert.deepEqual(Backend.filterTags(r2t, ['run1', 'run2']), Backend.getTags(r2t));
                chai.assert.deepEqual(Backend.filterTags(r2t, ['run1']), ['bar', 'foo', 'zod']);
                chai.assert.deepEqual(Backend.filterTags(r2t, ['run2', 'a']), ['foo', 'zod', 'zoink']);
                chai.assert.deepEqual(Backend.getRuns(empty1), []);
                chai.assert.deepEqual(Backend.getTags(empty1), []);
                chai.assert.deepEqual(Backend.getRuns(empty2), ['run1', 'run2']);
                chai.assert.deepEqual(Backend.getTags(empty2), []);
            });
        });
    })(Backend = TF.Backend || (TF.Backend = {}));
})(TF || (TF = {}));
