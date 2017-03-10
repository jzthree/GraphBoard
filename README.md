# GraphBoard

This is a standalone TensorFlow's graph visualizer frontend for directed graphs. The goal of this repository to provide a general purpose interactive graph visualizer (which TensorBoard already pretty much provided), as well as providing necessary documentations.


(Work in progress and help welcomed) I have removed as much unnecessary parts as I can safely identify in the first look. There are likely still a lot of clean up that can be done (I didn't remove any node.js dependencies for example). The code is working now. 


####TensorBoard graph visualization features:
* Load/reload files that include graph definitions in protobuf format.
* Automatic layout
* Foldable hierarchy
* Minimap which is also a avigator.
* Display node information in a foldable floating window

I was too lazy to inlcude an actual screenshot for this striped-down version it is basically the same except for that the header panel is remvoed. The example is a tensorflow computational graph but the implement is actually quite domain-agnostic so should be easy to adapt.
![](https://www.tensorflow.org/images/graph_vis_animation.gif)

####How to use:

To use gulp and plugins as webserver and livereload during development, run `npm run prepare;npm install gulp -g; gulp` (you may use nvm to install npm without root; expect some time to install all the dependencies). It will be served in localhost:8001 (if the port is also used it may throw an error). You can use any webserver you like.

A example is in `demo/index.html`. The example graph is in `demo/data/graph_run_agraph.pbtxt`


####Development:

Tensorboard uses Google's Polymer 1.7 as the frontend framework https://www.polymer-project.org/1.0/docs/devguide/feature-overview. The component reuse is provided by html import. It is my first time to see it but it seems reasonably simple to use.
```
tf-tensorboard
    tf-graph-dashboard
    :Essentially all the visible elements
        *tf-graph-loader
        :Load graph
        tf-graph-board
            tf-graph
                tf-graph-scene
                :Display the main graph
                    tf-graph-minimap
                    :Display the minimap when graph is zoomed in
                tf-graph-common
                    :The major javascript(typescript) library for graph drawing.

                
            tf-graph-info 
                :Displays node info in the floating side window  
                tf-node-info 
                    tf-node-list-item
                tf-graph-common


        tf-graph-control
        :Display the left panel that provide some control utilities like choosing graph
        *tf-dashboard
        *tf-backend
    *tf-backend
```
