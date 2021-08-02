/*
<javascriptresource>
<name>Mark Layer *</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {

    forEachLayer(doc, function(layer) {
        if(isMarked(layer, '*')) {
            unmark(layer, '*');
        }
    });

    var layer = doc.activeLayer;
    mark(layer, '*');
}

doc.suspendHistory ("Mark Layer *", "main()");
