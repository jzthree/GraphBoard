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

/**
 * @fileoverview Interfaces that parallel proto definitions in
 * third_party/tensorflow/core/framework/...
 *     graph.proto
 * These should stay in sync.
 */
module tfgraph.proto {
  /**
   * TensorFlow node definition as defined in the graph.proto file.
   */
  export interface NodeDef {
    /** Name of the node */
    name: string;
    /** List of nodes that are inputs for this node. */
    input: string[];
    /** The name of the operation associated with this node. */
    op: string;
    /** List of attributes that describe/modify the operation. */
    attr: {key: string, value: Object}[];
  }

  /**
   * Generic graph as defined in the graph_explorer.proto file.
   */
  export interface GenericGraph {
    /** List of nodes in the graph */
    node: GenericNode[];
    /** List of nodes in the graph */
    edge: GenericEdge[];
    /** List of attributes that describe/modify the operation. */
    attr: Array<{[key: string]: any}>;
  }

  /**
   * GenericEdge corresponds to the Edge message in graph_explorer.proto.
   */
  export interface GenericEdge {
    /** Name of the source node. */
    source: string;
    /** Name of the target node. */
    target: string;
    /** Attributes of the edge. */
    edge_attr: Array<{[key: string]: any}>;
  }

  /**
   * GenericNode corresponds to the Node message in graph_explorer.proto.
   */
  export interface GenericNode {
    /** Name of the node */
    name: string;
    /** Attributes of a leaf node or leaf nodes within a metanode. */
    node_attr: Array<{[key: string]: any}>;
    /** Attributes of a metanode. */
    metanode_attr: Array<{[key: string]: any}>;
  }

}
