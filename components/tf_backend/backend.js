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
var TF;
(function (TF) {
    var Backend;
    (function (Backend_1) {
        Backend_1.TYPES = [
            'graph', 'image', 'audio',
            'runMetadata'
        ];
        /**
         * The Backend class provides a convenient and typed interface to the backend.
         *
         * It provides methods corresponding to the different data sources on the
         * TensorBoard backend. These methods return a promise containing the data
         * from the backend. This class does some post-processing on the data; for
         * example, converting data elements tuples into js objects so that they can
         * be accessed in a more convenient and clearly-documented fashion.
         */
        var Backend = (function () {
            /**
             * Construct a Backend instance.
             * @param router the Router with info on what urls to get data from
             * @param requestManager The RequestManager, overwritable so you may
             * manually clear request queue, etc. Defaults to a new RequestManager.
             */
            function Backend(router, requestManager) {
                this.router = router;
                this.requestManager = requestManager || new Backend_1.RequestManager();
            }
            /**
             * Returns a listing of all the available data in the TensorBoard backend.
             */
            Backend.prototype.runs = function () {
                return this.requestManager.request(this.router.runs());
            };
            /**
             * Return a promise showing list of runs that contain graphs.
             */
            Backend.prototype.graphRuns = function () {
                return this.runs().then(function (x) { return _.keys(x).filter(function (k) { return x[k].graph; }); });
            };
            /**
             * Return a promise of a graph string from the backend.
             */
            Backend.prototype.graph = function (tag, limit_attr_size, large_attrs_key) {
                var url = this.router.graph(tag, limit_attr_size, large_attrs_key);
                return this.requestManager.request(url);
            };
            return Backend;
        }());
        Backend_1.Backend = Backend;
        /** Given a RunToTag, return sorted array of all runs */
        function getRuns(r) {
            return _.keys(r).sort(VZ.Sorting.compareTagNames);
        }
        Backend_1.getRuns = getRuns;
        /** Given a RunToTag, return array of all tags (sorted + dedup'd) */
        function getTags(r) {
            return _.union.apply(null, _.values(r)).sort(VZ.Sorting.compareTagNames);
        }
        Backend_1.getTags = getTags;
        /**
         * Given a RunToTag and an array of runs, return every tag that appears for
         * at least one run.
         * Sorted, deduplicated.
         */
        function filterTags(r, runs) {
            var result = [];
            runs.forEach(function (x) { return result = result.concat(r[x]); });
            return _.uniq(result).sort(VZ.Sorting.compareTagNames);
        }
        Backend_1.filterTags = filterTags;
        function timeToDate(x) { return new Date(x * 1000); }
        ;
        /**  Just a curryable map to make things cute and tidy. */
        function map(f) {
            return function (arr) { return arr.map(f); };
        }
        ;
    })(Backend = TF.Backend || (TF.Backend = {}));
})(TF || (TF = {}));
