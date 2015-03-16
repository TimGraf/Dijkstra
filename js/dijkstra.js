window.onload = function() {
    createGraph();
};

// List of dependant JavaScript files for this module
var jsFiles = [
    './lib/kinetic-v4.7.0.min.js',
    './js/GraphicsInterface.js',
    './js/DijkstraSolutionInterface.js'
];

// Load JavaScript files
for (var i = 0; i < jsFiles.length; i++) {
    document.write("<script type='text/javascript' src='" + jsFiles[i] + "'></script>");
}

function createGraph() {
    var numXNodes                 = 50,
        numYNodes                 = 50,
        graphicsInterface         = new GraphicsInterface(),
        dijkstraSolutionInterface = new DijkstraSolutionInterface(),
        sourceNode                = dijkstraSolutionInterface.createNode(1, 1),
        destinationNode           = dijkstraSolutionInterface.createNode(50, 50),
        graph,
        solution;

    graph    = dijkstraSolutionInterface.createGraphNodesWithBarrier(dijkstraSolutionInterface.ANGLE_BARRIER, numXNodes, numYNodes);
    solution = dijkstraSolutionInterface.createSolutionNodes(graph, sourceNode, destinationNode);

    graphicsInterface.init(numXNodes, numYNodes);
    graphicsInterface.drawGraph(graph);
    graphicsInterface.drawSolution(solution);
}