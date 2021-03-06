# GraphBoard

This is a standalone TensorFlow's graph visualizer frontend for directed graphs. The goal of this repository to provide a general purpose interactive graph visualizer (which TensorBoard already pretty much provided), as well as providing necessary documentations.


####TensorBoard graph visualization features:
* Load/reload files that include graph definitions in protobuf format.
* Automatic layout
* Foldable hierarchy
* Minimap which is also a avigator.
* Display node information in a foldable floating window

I was too lazy to inlcude an actual screenshot for this striped-down version it is basically the same except for that the header panel is remvoed. The example is a tensorflow computational graph but the implement is actually quite domain-agnostic so should be easy to adapt.
![](https://www.tensorflow.org/images/graph_vis_animation.gif)

####How to use:

To use gulp and plugins as webserver and livereload during development, run 
`git clone git://github.com/jzthree/GraphBoard.git; cd GraphBoard;npm run prepare;npm install gulp -g; gulp` 
(you may use nvm to install npm without root; expect some time to install all the dependencies). It will be served in localhost:8001 (if the port is also used it may throw an error). 

If you are using Mac OS X, unfortunately currently there is an issue with gulp livereload. You can temporarily disable it by setting 
`livereload: {     enable: false, ...}` in gulpfile.js.

I am running a gulp server on accio:8000 if you are in @functionlab. 

After you started the gulp webserver, an example is in `demo/index.html`. The example graph is in `demo/data/graph_run_agraph.pbtxt`


####Development:

(Work in progress and help welcomed) I have removed as much unnecessary parts as I can safely identify in the first look. There are still a lot of clean up that can be done (I didn't remove any node.js dependencies for example). The code is working standalone now.  A documentation site generated by typedoc for the core typescript library tf-graph-common can be viewed at https://jzthree.github.io/GraphBoard/.




Tensorboard uses Google's Polymer 1.7 as the frontend framework https://www.polymer-project.org/1.0/docs/devguide/feature-overview. The component reuse is provided by html import. It is my first time to see it but it seems reasonably simple to use. The components hierarchy is shown below:
```
tf-tensorboard
    tf-graph-dashboard
    :Graph and control components. 
        *tf-graph-loader
        :Load graph. This include example of calling tf-graph-common for building graph in its _parseAndConstructHierarchicalGraph function.
        tf-graph-board
            tf-graph
                tf-graph-scene
                :Display the main graph
                    tf-graph-minimap
                    :Display the minimap when graph is zoomed in
            tf-graph-info 
                :Displays node info in the floating side window  
                tf-node-info 
                    tf-node-list-item

        tf-graph-control
        :Display the left panel that provide some control utilities like choosing graph
        *tf-dashboard
        *tf-backend
    *tf-backend
```

tf-graph-common is the major library for graph drawing. A documentation site generated by typedoc can be viewed at https://jzthree.github.io/GraphBoard/.
```
tg-graph-common
    scene
        annotation
        contextmenu
        edge
        minimap
        node
        scene
    colors
    :Map op category to color. (This should be exposed as API)
    common
    externs
    graph
    hierarchy
    layout
    parser
    proto
    render
    template
    util
        
```

Polymer components

tfgraph

RenderHierarchy -> LayoutScene
