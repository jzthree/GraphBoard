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
suite('graph', function () {
    var assert = chai.assert;
    test('graphlib exists', function () { assert.isTrue(graphlib != null); });
    test('simple graph contruction', function (done) {
        var pbtxt = tfgraph.test.util.stringToArrayBuffer("\n      node {\n        name: \"Q\"\n        op: \"Input\"\n      }\n      node {\n        name: \"W\"\n        op: \"Input\"\n      }\n      node {\n        name: \"X\"\n        op: \"MatMul\"\n        input: \"Q:2\"\n        input: \"W\"\n      }");
        var buildParams = {
            enableEmbedding: true,
            inEmbeddingTypes: ['Const'],
            outEmbeddingTypes: ['^[a-zA-Z]+Summary$'],
            refEdges: {}
        };
        var dummyTracker = tfgraph.util.getTracker({ set: function () { return; }, progress: 0 });
        tfgraph.parser.parseGraphPbTxt(pbtxt).then(function (nodes) {
            tfgraph.build(nodes, buildParams, dummyTracker)
                .then(function (slimGraph) {
                assert.isTrue(slimGraph.nodes['X'] != null);
                assert.isTrue(slimGraph.nodes['W'] != null);
                assert.isTrue(slimGraph.nodes['Q'] != null);
                var firstInputOfX = slimGraph.nodes['X'].inputs[0];
                assert.equal(firstInputOfX.name, 'Q');
                assert.equal(firstInputOfX.outputTensorIndex, 2);
                var secondInputOfX = slimGraph.nodes['X'].inputs[1];
                assert.equal(secondInputOfX.name, 'W');
                assert.equal(secondInputOfX.outputTensorIndex, 0);
            });
        });
    });
    // TODO(bp): write tests.
});
