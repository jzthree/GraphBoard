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

module TF.Backend {
  export interface RunEnumeration {
    graph: boolean;
  }

  export interface LogdirResponse { logdir: string; }

  export interface RunsResponse { [runName: string]: RunEnumeration; }

  export type RunToTag = {[run: string]: string[];};



  export var TYPES = [
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
  export class Backend {
    public router: Router;
    public requestManager: RequestManager;

    /**
     * Construct a Backend instance.
     * @param router the Router with info on what urls to get data from
     * @param requestManager The RequestManager, overwritable so you may
     * manually clear request queue, etc. Defaults to a new RequestManager.
     */
    constructor(router: Router, requestManager?: RequestManager) {
      this.router = router;
      this.requestManager = requestManager || new RequestManager();
    }



    /**
     * Returns a listing of all the available data in the TensorBoard backend.
     */
    public runs(): Promise<RunsResponse> {
      return this.requestManager.request(this.router.runs());
    }

    /**
     * Return a promise showing list of runs that contain graphs.
     */
    public graphRuns(): Promise<string[]> {
      return this.runs().then(
          (x) => { return _.keys(x).filter((k) => x[k].graph); });
    }

    /**
     * Return a promise of a graph string from the backend.
     */
    public graph(
        tag: string, limit_attr_size?: number,
        large_attrs_key?: string): Promise<string> {
      let url = this.router.graph(tag, limit_attr_size, large_attrs_key);
      return this.requestManager.request(url);
    }

  }
  /** Given a RunToTag, return sorted array of all runs */
  export function getRuns(r: RunToTag): string[] {
    return _.keys(r).sort(VZ.Sorting.compareTagNames);
  }

  /** Given a RunToTag, return array of all tags (sorted + dedup'd) */
  export function getTags(r: RunToTag): string[] {
    return _.union.apply(null, _.values(r)).sort(VZ.Sorting.compareTagNames);
  }

  /**
   * Given a RunToTag and an array of runs, return every tag that appears for
   * at least one run.
   * Sorted, deduplicated.
   */
  export function filterTags(r: RunToTag, runs: string[]): string[] {
    var result = [];
    runs.forEach((x) => result = result.concat(r[x]));
    return _.uniq(result).sort(VZ.Sorting.compareTagNames);
  }

  function timeToDate(x: number): Date { return new Date(x * 1000); };

  /**  Just a curryable map to make things cute and tidy. */
  function map<T, U>(f: (x: T) => U): (arr: T[]) => U[] {
    return function(arr: T[]): U[] { return arr.map(f); };
  };

}
