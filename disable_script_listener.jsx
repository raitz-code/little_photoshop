/*
<javascriptresource>
<name>Disable Script Listener</name>
<category>utils</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var listenerID = stringIDToTypeID("AdobeScriptListener ScriptListener");
var keyLogID = charIDToTypeID('Log ');
var d = new ActionDescriptor;
d.putBoolean(keyLogID, false);
executeAction(listenerID, d, DialogModes.NO);