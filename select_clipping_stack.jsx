/*
<javascriptresource>
<name>Select Clipping Stack</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    selectMultipleByIDs(getClippingStackIDs(doc));
}

doc.suspendHistory ("Select Clipping Stack", "main()");
