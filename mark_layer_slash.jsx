/*
<javascriptresource>
<name>Mark Layer /</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;

function main() {
    var symbol = '/';
    markActive(symbol);
}

doc.suspendHistory ("Mark Layer /", "main()");
