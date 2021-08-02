/*
<javascriptresource>
<name>Push to Clipping Stack Top</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var layers = getClippingStackLayers(doc);
    var colorLabel = getLayerLabelColor();
    var newLayer = doc.artLayers.add();
    newLayer.moveBefore(layers[0]);
    newLayer.grouped = true;
    setLayerLabelColor(colorLabel);
}

doc.suspendHistory ("Push to Clipping Stack Top", "main()");
