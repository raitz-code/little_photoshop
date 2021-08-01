/*
<javascriptresource>
<name>Flatten Clipping Stack Top</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var layers = getClippingStackLayers(doc);
    for (var i = layers.length - 2; i >= 0; i--) {
        layers[i].merge();
    }
}

doc.suspendHistory ("Flatten Clipping Stack Top", "main()");
