GraphicsInterface = function() {
    "use strict";

    if (!(this instanceof GraphicsInterface)) {
        return new GraphicsInterface();
    }

    var publicInterface,
        radius,
        stage,
        layer;

    function init(numXNodes, numYNodes) {
        radius = 2;
        stage  = _createKineticStage(numXNodes, numYNodes, radius);
        layer  = _createKineticLayer();
    }

    function drawGraph(graph) {

        if (_graphicsInitialized()) {
            _drawNodes(stage, layer, graph, radius, 'white');
        }
    }

    function drawSolution(solution) {

        if (_graphicsInitialized()) {
            _drawNodes(stage, layer, solution, radius, 'red');
        }
    }

    function _graphicsInitialized() {
        return (typeof radius !== 'undefined') && (typeof stage !== 'undefined') && (typeof radius !== 'undefined')
    }

    function _createKineticStage(numXNodes, numYNodes, radius) {
        return new Kinetic.Stage({
            container: 'container',
            width: numXNodes * (radius * 2 + 2),
            height: numYNodes * (radius * 2 + 2)
        });
    }

    function _createKineticLayer() {
        return new Kinetic.Layer();
    }

    function _drawNodes(stage, layer, nodes, radius, color) {
        var xPos,
            yPos;

        nodes.forEach(function(node) {

            if (node !== undefined) {
                xPos = (node.x == 1) ? radius + 1 : ((node.x - 1) * ((radius * 2) + 2)) + (radius + 1);
                yPos = (node.y == 1) ? radius + 1 : ((node.y - 1) * ((radius * 2) + 2)) + (radius + 1);

                _drawNode(layer, xPos, yPos, radius, color);
            }
        });

        stage.add(layer);
    }

    function _drawNode(layer, xPos, yPos, radius, color) {
        layer.add(new Kinetic.Circle({
            x: xPos,
            y: yPos,
            radius: radius,
            fill: color,
            stroke: 'black',
            strokeWidth: 1
        }));
    }

    publicInterface = {
        init:         init,
        drawGraph:    drawGraph,
        drawSolution: drawSolution
    };

    return publicInterface;
};
