/*
<javascriptresource>
<name>To Clipping Stack Bottom</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var layers = getClippingStackLayers(doc);
    doc.activeLayer = layers[layers.length-1];
}

doc.suspendHistory ("To Clipping Stack Bottom", "main()");
