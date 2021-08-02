/*
<javascriptresource>
<name>Marked to Layer /</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;


function main() {
    var allLayers = collectAllLayers(doc, allLayers);

    for(var i = 0; i < allLayers.length; i++) {
        var layer = allLayers[i];
        if (isMarked(layer, '/')) {
            doc.activeLayer = layer;
            break;
        }
    }
}

doc.suspendHistory ("Marked to Layer /", "main()");

