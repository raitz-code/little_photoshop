/*
<javascriptresource>
<name>Bake Clipping Stack</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    selectMultipleByIDs(getClippingStackIDs(doc));
    callScript("/lf_bake_to_normal.jsx");

    var layers = getClippingStackLayers(doc);
    for (var i = 0; i < layers.length-1; i++) {
        layers[i].grouped = false;
    }
}

doc.suspendHistory ("Bake Clipping Stack", "main()");
