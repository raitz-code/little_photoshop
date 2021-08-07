/*
<javascriptresource>
<name>Marked to Layer /</name>
<category>Little Photoshop</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#include "./utils.jsx"

var doc = app.activeDocument;


function main() {
    var symbol = '/';
    selectMarked(symbol);
}

doc.suspendHistory ("Marked to Layer /", "main()");

