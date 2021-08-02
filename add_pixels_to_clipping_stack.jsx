/*
<javascriptresource>
<name>Add Pixels to Clipping Stack</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    disableQuickMask(doc);
    fill(doc);

    var layers = getClippingStackLayers(doc);
    var activeLayer = doc.activeLayer;
    doc.activeLayer = layers[layers.length-1];
    swapForegroundBackgroundColor();
    fill(doc);
    swapForegroundBackgroundColor();
    doc.activeLayer = activeLayer;
    doc.selection.deselect();
}

doc.suspendHistory ("Add Pixels To Clipping Stack", "main()");
