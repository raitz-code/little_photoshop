/*
<javascriptresource>
<name>To Clipping Stack Top</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var layers = getClippingStackLayers(doc);
    doc.activeLayer = layers[0];
}

doc.suspendHistory ("To Clipping Stack Top", "main()");
