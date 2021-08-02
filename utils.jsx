/*
<javascriptresource>
<name>utils</name>
<category>utils</category>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

function forEachLayer(doc, fun) {
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        fun(theLayer);
        if (theLayer.typename === "LayerSet"){
            forEachLayer(theLayer, fun);
        }
    }
}

function isMarked(layer) {
    return layer.name.slice(-2) == ' ^';
}

function unmark(layer) {
    var visible = layer.visible;
    layer.name = layer.name.slice(0, -2);
    layer.visible = visible;
}

function mark(layer) {
    if (!isMarked(layer)) {
        var visible = layer.visible;
        layer.name = layer.name + ' ^';
        layer.visible = visible;
    }
}

var collectAllLayers = function(doc) {
    var allLayers = [];
    forEachLayer(doc, function(layer) {
        allLayers.push(layer);
    });
    return allLayers;
};


// Layer Selection

function doesIdExists( id ){// function to check if the id exists
   var res = true;
   var ref = new ActionReference();
   ref.putIdentifier(charIDToTypeID('Lyr '), id);
    try{var desc = executeActionGet(ref)}catch(err){res = false};
    return res;
}

function selectByID(id)
{
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putIdentifier(charIDToTypeID('Lyr '), id);
  desc1.putReference(charIDToTypeID('null'), ref1);
  executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
};

function selectMultipleByIDs(ids) {
    if( ids.constructor != Array ) ids = [ ids ];
    var layers = new Array();
    var id54 = charIDToTypeID( "slct" );
    var desc12 = new ActionDescriptor();
    var id55 = charIDToTypeID( "null" );
    var ref9 = new ActionReference();
    for (var i = 0; i < ids.length; i++) {
       if(doesIdExists(ids[i]) == true){// a check to see if the id stil exists
           layers[i] = charIDToTypeID( "Lyr " );
           ref9.putIdentifier(layers[i], ids[i]);
       }
    }
    desc12.putReference( id55, ref9 );
    var id58 = charIDToTypeID( "MkVs" );
    desc12.putBoolean( id58, false );
    executeAction( id54, desc12, DialogModes.NO );
}

// this will get IDs of selected layers/groups/artboards
function getSelectedLayersIDs()
{
  var lyrs = [];
  var lyr;
  var ref = new ActionReference();
  var desc;
  var tempIndex;
  var ref2;

  ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("targetLayers"));
  ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));

  var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
  for (var i = 0; i < targetLayers.count; i++)
  {
    tempIndex = 0;
    ref2 = new ActionReference();
    try
    {
      activeDocument.backgroundLayer;
      ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex());
      try
      {
        desc = executeActionGet(ref2);
        tempIndex = desc.getInteger(stringIDToTypeID("itemIndex")) - 1;
      }
      catch (e)
      {
        tempIndex = 0;
      }
    }
    catch (o)
    {
      ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex() + 1);
      desc = executeActionGet(ref2);
      tempIndex = desc.getInteger(stringIDToTypeID("itemIndex"));
    }

    lyrs.push(desc.getInteger(stringIDToTypeID("layerID")));
  }

  return lyrs;
};

function getSelectedLayersIdx(){   
    var selectedLayers = new Array;   
    var ref = new ActionReference();   
    ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );   
    var desc = executeActionGet(ref);   

    if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){   
        desc = desc.getList( stringIDToTypeID( 'targetLayers' ));   
        var c = desc.count   

        var selectedLayers = new Array();   

        for(var i=0;i<c;i++){   
            try{   
               activeDocument.backgroundLayer;   
               selectedLayers.push(  desc.getReference( i ).getIndex() );   
            }catch(e){   
               selectedLayers.push(  desc.getReference( i ).getIndex()+1 );   
            }   
        }   
    } else {   
        var ref = new ActionReference();   
        ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));   
        ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );   
        try{   
            activeDocument.backgroundLayer;   
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);   
        }catch(e){   
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));   
        }   
    }   
    return selectedLayers;   
};  


function makeActiveByIndex( idx, visible ){   
    var desc = new ActionDescriptor();   
    var ref = new ActionReference();   
    ref.putIndex(charIDToTypeID( "Lyr " ), idx)   
    desc.putReference( charIDToTypeID( "null" ), ref );   
    desc.putBoolean( charIDToTypeID( "MkVs" ), visible );   
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );   
};  


function makeActiveByID( id, visible ){   
    var desc = new ActionDescriptor();   
    var ref = new ActionReference();   
    ref.putIdentifier(charIDToTypeID( "Lyr " ), id)   
    desc.putReference( charIDToTypeID( "null" ), ref );   
    desc.putBoolean( charIDToTypeID( "MkVs" ), visible );   
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );   
};  


function getLayerLabelColor(){
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var appDesc = executeActionGet(ref);
    return typeIDToStringID(appDesc.getEnumerationValue(stringIDToTypeID('color')) );
};

// "none","red","orange","yellowColor","grain","blue","violet","gray"
function setLayerLabelColor(colorLabel) {
    var target = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    target.putReference( charIDToTypeID('null'), ref1 );

    var colorize = new ActionDescriptor();
    colorize.putEnumerated( charIDToTypeID('Clr '), charIDToTypeID('Clr '), stringIDToTypeID(colorLabel) );
    target.putObject( charIDToTypeID('T   '), charIDToTypeID('Lyr '), colorize );
    executeAction( charIDToTypeID('setd'), target, DialogModes.NO );
};

// Clipping Stack

function getClippingStackLayers(doc) {
    var layer = doc.activeLayer;
    var layers = collectAllLayers(doc);
    var index = -1;
    for (var i = 0; i < layers.length; i++) {
        if(layers[i] == layer) {
            index = i;
            break;
        }
    }

    var ids = [];

    var i = index;
    for (i = index - 1; i >= 0 ; i--) {
        if(!layers[i].grouped) {
            break;
        }
        ids.push(layers[i]);
    }
    ids.reverse();

    ids.push(layer);

    if (layer.grouped) {
        var i = index;
        for (i = index + 1; i < layers.length ; i++) {
            ids.push(layers[i]);
            if(!layers[i].grouped) {
                break;
            }
        }
    }

    return ids;
}

function getClippingStackIDs(doc) {
    var layers = getClippingStackLayers(doc);
    var ids = [];
    for (var i = 0; i < layers.length; i++) {
        ids.push(layers[i].id);
    }
    return ids;
}


// Other Scripts

function callScript(path) {
    var SCRIPTS_FOLDER =  decodeURI(app.path + '/' + localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts"));
    var geo_dynamic = File(SCRIPTS_FOLDER + path);
    //var Script2 = File(SCRIPTS_FOLDER + "/Script2.jsx");
    //var Script3 = File(SCRIPTS_FOLDER + "/Script3.jsx");
    $.evalFile (geo_dynamic);
    //$.evalFile (Script2);
    //$.evalFile (Script3);
}


// Quick Mask

function enableQuickMask(doc) {
    var idsetd = charIDToTypeID( "setd" );
    var desc14 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref1 = new ActionReference();
    var idPrpr = charIDToTypeID( "Prpr" );
    var idQucM = charIDToTypeID( "QucM" );
    ref1.putProperty( idPrpr, idQucM );
    var idDcmn = charIDToTypeID( "Dcmn" );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref1.putEnumerated( idDcmn, idOrdn, idTrgt );
    desc14.putReference( idnull, ref1 );
    executeAction( idsetd, desc14, DialogModes.NO );
}


function disableQuickMask(doc) {
    var idCler = charIDToTypeID( "Cler" );
    var desc16 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref2 = new ActionReference();
    var idPrpr = charIDToTypeID( "Prpr" );
    var idQucM = charIDToTypeID( "QucM" );
    ref2.putProperty( idPrpr, idQucM );
    var idDcmn = charIDToTypeID( "Dcmn" );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref2.putEnumerated( idDcmn, idOrdn, idTrgt );
    desc16.putReference( idnull, ref2 );
    executeAction( idCler, desc16, DialogModes.NO );
}


// Color

// Depend on a custom action
function fill(doc) {
    var idPly = charIDToTypeID( "Ply " );
    var desc20 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref3 = new ActionReference();
    var idActn = charIDToTypeID( "Actn" );
    ref3.putName( idActn, "Fill" );
    var idASet = charIDToTypeID( "ASet" );
    ref3.putName( idASet, "Paint Operation" );
    desc20.putReference( idnull, ref3 );
    executeAction( idPly, desc20, DialogModes.NO );
}

function swapForegroundBackgroundColor() {
    var temp;
    temp = app.foregroundColor;
    app.foregroundColor = app.backgroundColor;
    app.backgroundColor = temp;
}