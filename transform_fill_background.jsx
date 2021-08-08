/*
<javascriptresource>
<name>Transform and Fill Background</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var layer = doc.activeLayer;

    if (layer.transparentPixelsLocked) {
        transform_fill_background();
    }
    else {
        alert("Transparency is not locked. Use normal transform tool instead.");
    }
}

function transform_fill_background() {
    var layer = doc.activeLayer;
    var name = layer.name;
    var blendMode = layer.blendMode;
    var fill_color;

    switch (blendMode) {
        case BlendMode.LINEARDODGE:
            fill_color = CONST.BLACK;
            break;
        case BlendMode.MULTIPLY:
            fill_color = CONST.WHITE;
            break;
        case BlendMode.OVERLAY:
            fill_color = CONST.GRAY_50;
            break;
        case BlendMode.SOFTLIGHT:
            fill_color = CONST.GRAY_50;
            break;
        case BlendMode.HARDLIGHT:
            fill_color = CONST.GRAY_50;
            break;
        default:
            alert("Not supported blend mode!");
            return;
    }

    createLayerViaCut();
    freeTransformDialog();
    selectLayerRelative(CONST.BACKWARD);
    createLayer('_Fill_Background');
    fill(fill_color);
    deselect();
    moveLayer(CONST.PREVIOUS);
    selectLayerRelative(CONST.FOREWARD);
    mergeDown();
    selectLayerRelative(CONST.FOREWARD);
    mergeDown();

    var resultLayer = doc.activeLayer;
    resultLayer.name = name;
    resultLayer.transparentPixelsLocked = true;
    resultLayer.blendMode = blendMode;
}


doc.suspendHistory ("Transform Fill Background", "main()");
