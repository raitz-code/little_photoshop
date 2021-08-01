function forEachLayer(doc, fun) {
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        fun(theLayer);
        if (theLayer.typename === "LayerSet"){
            forEachLayer(theLayer, fun);
        }
    }
}

function isMarked(layer) {
    return layer.name.slice(-2) == ' ^';
}

function unmark(layer) {
    var visible = layer.visible;
    layer.name = layer.name.slice(0, -2);
    layer.visible = visible;
}

function mark(layer) {
    if (!isMarked(layer)) {
        var visible = layer.visible;
        layer.name = layer.name + ' ^';
        layer.visible = visible;
    }
}

var collectAllLayers = function(doc) {
    var allLayers = [];
    forEachLayer(doc, function(layer) {
        allLayers.push(layer);
    });
    return allLayers;
};