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

suite('graph', () => {
  let assert = chai.assert;

  test('graphlib exists', () => { assert.isTrue(graphlib != null); });

  test('simple graph contruction', done => {
    let pbtxt = tfgraph.test.util.stringToArrayBuffer(`
      node {
        name: "Q"
        op: "Input"
      }
      node {
        name: "W"
        op: "Input"
      }
      node {
        name: "X"
        op: "MatMul"
        input: "Q:2"
        input: "W"
      }`);


    let buildParams: tfgraph.BuildParams = {
      enableEmbedding: true,
      inEmbeddingTypes: ['Const'],
      outEmbeddingTypes: ['^[a-zA-Z]+Summary$'],
      refEdges: {}
    };
    let dummyTracker =
        tfgraph.util.getTracker({set: () => { return; }, progress: 0});
    tfgraph.parser.parseGraphPbTxt(pbtxt).then(nodes => {
      tfgraph.build(nodes, buildParams, dummyTracker)
          .then((slimGraph: tfgraph.SlimGraph) => {
            assert.isTrue(slimGraph.nodes['X'] != null);
            assert.isTrue(slimGraph.nodes['W'] != null);
            assert.isTrue(slimGraph.nodes['Q'] != null);

            let firstInputOfX = slimGraph.nodes['X'].inputs[0];
            assert.equal(firstInputOfX.name, 'Q');
            assert.equal(firstInputOfX.outputTensorIndex, 2);

            let secondInputOfX = slimGraph.nodes['X'].inputs[1];
            assert.equal(secondInputOfX.name, 'W');
            assert.equal(secondInputOfX.outputTensorIndex, 0);

          });
    });
  });


  // TODO(bp): write tests.
});
