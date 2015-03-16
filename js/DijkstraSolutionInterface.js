DijkstraSolutionInterface = function() {
    "use strict";

    if (!(this instanceof DijkstraSolutionInterface)) {
        return new DijkstraSolutionInterface();
    }

    var publicInterface;

    function createNode(x, y) {
        return {
            x: x,
            y: y,
            equals: function(node) {
                return ((this.x == node.x) && (this.y == node.y))
            },
            distanceTo: function(node) {
                var x = Math.abs(node.x - this.x);
                var y = Math.abs(node.y - this.y);

                return Math.sqrt((x * x) + (y * y));
            }
        }
    }

    function createGraphNodesWithBarrier(barrierName, numXNodes, numYNodes) {
        var barrier = _createBarrier(barrierName);

        return _createGraphNodes(barrier, numXNodes, numYNodes)
    }

    function createSolutionNodes(graph, sourceNode, destinationNode) {
        var solution,
            path,
            queue;

        queue = _initializeQueue(graph, sourceNode);
        path  = _initializePath(graph);

        while (queue.length > 0) {
            var minDistQueueIndex = _getNodeIndexFromQueueWithMinDist(queue),
                minDistance       = queue[minDistQueueIndex].dist,
                evalNode          = graph[queue[minDistQueueIndex].nodeIndex];

            queue.splice(minDistQueueIndex, 1);

            if (evalNode.equals(destinationNode)) {
                solution = _createSolutionFromPath(destinationNode, graph, path);
                break;
            }

            _evaluateNeighbors(graph, queue, path, evalNode, minDistance);
        }

        return solution;
    }

    function _createGraphNodes(barrier, numXNodes, numYNodes) {
        var graph = [],
            x = 1,
            y = 1;

        while (y <= numYNodes) {

            while (x <= numXNodes) {
                var node = createNode(x, y);

                if (!_nodeExistsIn(node, barrier)) {
                    graph.push(node);
                }

                x++;
            }

            x = 1;
            y++;
        }

        return graph;
    }

    function _createBarrier(type) {
        var barrier = [];

        switch (type) {
            case 'rectangle':
                barrier = _createRectangleBarrier();
                break;
            case 'angle':
                barrier = _createAngleBarrier();
                break;
            case 'slant':
                barrier = _createSlantBarrier();
                break;
            default:
                barrier = [];
        }

        return barrier;
    }

    // TODO - Normalize the barrier based on the graph size
    function _createRectangleBarrier() {
        var barrier = [];

        for (var x = 15; x < 40; x++) {

            for (var y = 20; y < 23; y++) {
                barrier.push(createNode(x, y));
            }
        }

        return barrier;
    }

    // TODO - Normalize the barrier based on the graph size
    function _createSlantBarrier() {
        var barrier = [],
            x,
            y;

        for (y = 15; y < 35; y++) {

            for (x = 50 - y; x > 46 - y; x--) {
                barrier.push(createNode(x, y));
            }
        }

        return barrier;
    }

    // TODO - Normalize the barrier based on the graph size
    function _createAngleBarrier() {
        var barrier = [],
            x,
            y;

        for (x = 15; x < 40; x++) {

            for (y = 20; y < 23; y++) {
                barrier.push(createNode(x, y));
            }
        }

        for (x = 37; x < 40; x++) {

            for (y = 23; y < 45; y++) {
                barrier.push(createNode(x, y));
            }
        }

        return barrier;
    }

    function _initializeQueue(graph, sourceNode) {
        var queue = [];

        graph.forEach(function(node, index) {
            var dist = (node.equals(sourceNode)) ? 0 : Infinity;

            queue.push({nodeIndex: index, dist: dist});
        });

        return queue;
    }

    function _initializePath(graph) {
        var path = [];

        graph.forEach(function() {
            path.push(undefined);
        });

        return path;
    }

    function _createSolutionFromPath(destinationNode, graph, path) {
        var index    = _getNodeIndexFromGraph(destinationNode, graph),
            solution = [];

        solution.push(destinationNode);

        while (path[index] !== undefined) {
            var nodeInPath = graph[path[index]];

            solution.push(nodeInPath);
            index = path[index];
        }

        return solution;
    }

    function _evaluateNeighbors(graph, queue, path, evalNode, minDistance) {
        var neighbors = _getNodeNeighborsFromGraph(evalNode, graph);

        neighbors.forEach(function(neighbor) {
            var altDist = minDistance + evalNode.distanceTo(neighbor),
                neighborGraphIndex = _getNodeIndexFromGraph(neighbor, graph),
                neighborQueueIndex = _getQueueIndex(neighborGraphIndex, queue);

            if (neighborQueueIndex >= 0) {

                if (altDist < queue[neighborQueueIndex].dist) {
                    queue[neighborQueueIndex].dist = altDist;
                    path[neighborGraphIndex] = _getNodeIndexFromGraph(evalNode, graph);
                }
            }
        });
    }

    function _getNodeIndexFromGraph(node, graph) {
        var index = 0;

        try {
            graph.forEach(function(graphNode) {

                if (graphNode !== undefined) {
                    if (node.equals(graphNode)) {
                        throw new Error("Found");
                    } else {
                        index++;
                    }
                }
            });
        } catch(e) {
            return index;
        }

        return -1;
    }

    function _getQueueIndex(nodeIndex, queue) {
        var index = 0;

        try {
            queue.forEach(function(queueNode) {

                if (nodeIndex === queueNode.nodeIndex) {
                    throw new Error("Found");
                } else {
                    index++;
                }
            });
        } catch(e) {
            return index;
        }

        return -1;
    }

    function _getNodeNeighborsFromGraph(node, array) {
        var neighbors = [],
            ur = createNode(node.x + 1, node.y + 1),
            uc = createNode(node.x, node.y + 1),
            ul = createNode(node.x - 1, node.y + 1),
            cl = createNode(node.x - 1, node.y),
            ll = createNode(node.x - 1, node.y - 1),
            lc = createNode(node.x, node.y - 1),
            lr = createNode(node.x + 1, node.y - 1),
            cr = createNode(node.x + 1, node.y);

        if (_nodeExistsIn(ur, array)) {
            neighbors.push(ur);
        }

        if (_nodeExistsIn(uc, array)) {
            neighbors.push(uc);
        }

        if (_nodeExistsIn(ul, array)) {
            neighbors.push(ul);
        }

        if (_nodeExistsIn(cl, array)) {
            neighbors.push(cl);
        }

        if (_nodeExistsIn(ll, array)) {
            neighbors.push(ll);
        }

        if (_nodeExistsIn(lc, array)) {
            neighbors.push(lc);
        }

        if (_nodeExistsIn(lr, array)) {
            neighbors.push(lr);
        }

        if (_nodeExistsIn(cr, array)) {
            neighbors.push(cr);
        }

        return neighbors;
    }

    function _getNodeIndexFromQueueWithMinDist(nodeDistArray) {
        var minDistIndex = -1,
            minDistValue = Infinity;

        nodeDistArray.forEach(function(nodeDist, index) {

            if (nodeDist.dist < minDistValue) {
                minDistIndex = index;
                minDistValue = nodeDist.dist
            }
        });

        return minDistIndex;
    }

    function _nodeExistsIn(node, nodeArray) {

        try {
            nodeArray.forEach(function(currentNode) {

                if (node.equals(currentNode)) {
                    throw new Error("Found");
                }
            });
        } catch(e) {
            return true;
        }

        return false;
    }

    publicInterface = {
        NO_BARRIER:                  '',
        RECTANGLE_BARRIER:           'rectangle',
        ANGLE_BARRIER:               'angle',
        SLANT_BARRIER:               'slant',
        createGraphNodesWithBarrier: createGraphNodesWithBarrier,
        createSolutionNodes:         createSolutionNodes,
        createNode:                  createNode
    };

    return publicInterface;
};