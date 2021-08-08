/*
<javascriptresource>
<name>utils</name>
<category>utils</category>
<enableinfo>false</enableinfo>
</javascriptresource>
*/

#include "./consts.jsx"

function forEachLayer(doc, fun) {
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        fun(theLayer);
        if (theLayer.typename === "LayerSet"){
            forEachLayer(theLayer, fun);
        }
    }
}


var collectAllLayers = function(doc) {
    var allLayers = [];
    forEachLayer(doc, function(layer) {
        allLayers.push(layer);
    });
    return allLayers;
};


// Mark Layer

function getMetadata(key) {
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");     
    }
    var doc = app.activeDocument;
    var xmp = new XMPMeta(doc.xmpMetadata.rawData);       
    var value = xmp.getProperty(XMPConst.NS_XMP, key);  
    return value;
}

function setMetadata(key, value) {
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");     
    }
    var doc = app.activeDocument;
    var xmp = new XMPMeta(doc.xmpMetadata.rawData);       
    xmp.deleteProperty(XMPConst.NS_XMP, key);   
    value = xmp.setProperty(XMPConst.NS_XMP, key, value);
    doc.xmpMetadata.rawData = xmp.serialize();
}

function markedMetadataKey(symbol) {
    switch (symbol) {
        case '/':
            return 'MarkedLayerSlash';
        case '*':
            return 'MarkedLayerAsterisk';
        default:
            throw 'Invalide Mark Symbol';
    }
}

function isMarked(layer, symbol) {
    var marked = getMetadata(MARKED_LAYER_ID_KEY);
    return layer.id == marked;
}

function selectMarked(symbol) {
    var marked = getMetadata(markedMetadataKey(symbol));
    if (marked) {
        selectByID(parseInt(marked));
    }
}

function unmarkActive(symbol) {
    var doc = app.activeDocument;
    var layer = doc.activeLayer;
    var visible = layer.visible; // Changing layer name always makes it visible... 
    layer.name = layer.name.replace(' ' + symbol, '');
    layer.visible = visible; // ... but we want it to keep original visibility.
    if (getMetadata(markedMetadataKey(symbol)) == layer.id) {
        setMetadata(markedMetadataKey(symbol), '');
    }
}

function markActive(symbol) {
    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    selectMarked(symbol);
    unmarkActive(symbol);
    doc.activeLayer = layer;

    var visible = layer.visible;  // Changing layer name always makes it visible... 
    // Remove existing symbol first in case it's in the middle
    layer.name = layer.name.replace(' ' + symbol, '') + ' ' + symbol;
    layer.visible = visible;  // ... but we want it to keep original visibility.
    setMetadata(markedMetadataKey(symbol), layer.id);
}


// Layer Selection

function doeskExists( id ){// function to check if the id exists
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
  try {
    executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
  }
  catch (e) {
      alert('No Marked Layer');
  }
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

function enableQuickMask() {
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


function disableQuickMask() {
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

function fill(with_color, opacity) {
    opacity = (typeof opacity !== 'undefined') ?  opacity : 100.0

    var idFl = charIDToTypeID( "Fl  " );
    var desc490 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
    var idFlCn = charIDToTypeID( "FlCn" );
    var idBckC = charIDToTypeID( with_color );
    desc490.putEnumerated( idUsng, idFlCn, idBckC );
    var idOpct = charIDToTypeID( "Opct" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc490.putUnitDouble( idOpct, idPrc, opacity );
    var idMd = charIDToTypeID( "Md  " );
    var idBlnM = charIDToTypeID( "BlnM" );
    var idNrml = charIDToTypeID( "Nrml" );
    desc490.putEnumerated( idMd, idBlnM, idNrml );
    executeAction( idFl, desc490, DialogModes.NO )
}

function swapForegroundBackgroundColor() {
    var temp;
    temp = app.foregroundColor;
    app.foregroundColor = app.backgroundColor;
    app.backgroundColor = temp;
}


// Layer

function createLayer(name) {
    var idMk = charIDToTypeID( "Mk  " );
    var desc485 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref9 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    ref9.putClass( idLyr );
    desc485.putReference( idnull, ref9 );
    var idUsng = charIDToTypeID( "Usng" );
    var desc486 = new ActionDescriptor();
    var idNm = charIDToTypeID( "Nm  " );
    desc486.putString( idNm, name);
    executeAction( idMk, desc485, DialogModes.NO );
}

function createLayerViaCut() {
    var idCtTL = charIDToTypeID( "CtTL" );
    executeAction( idCtTL, undefined, DialogModes.NO );
}

function moveLayer(toward) {
    var idmove = charIDToTypeID( "move" );
    var desc494 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref10 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref10.putEnumerated( idLyr, idOrdn, idTrgt );
    desc494.putReference( idnull, ref10 );
    var idT = charIDToTypeID( "T   " );
    var ref11 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idPrvs = charIDToTypeID( toward );
    ref11.putEnumerated( idLyr, idOrdn, idPrvs );
    desc494.putReference( idT, ref11 );
    executeAction( idmove, desc494, DialogModes.NO );
}

function mergeDown() {
    var idMrgtwo = charIDToTypeID( "Mrg2" );
    var desc2655 = new ActionDescriptor();
    executeAction( idMrgtwo, desc2655, DialogModes.NO );
}

function selectLayerRelative(direction) {
    var idslct = charIDToTypeID( "slct" );
    var desc480 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref8 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idBckw = charIDToTypeID( direction );
    ref8.putEnumerated( idLyr, idOrdn, idBckw );
    desc480.putReference( idnull, ref8 );
    executeAction( idslct, desc480, DialogModes.NO );
}


// Transform

function freeTransformDialog() {
    var idTrnf = charIDToTypeID( "Trnf" );
    var desc478 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref7 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref7.putEnumerated( idLyr, idOrdn, idTrgt );
    desc478.putReference( idnull, ref7 );
    executeAction( idTrnf, desc478, DialogModes.ALL );
}


// Selection

function saveSelection(channel_name) {
    var idDplc = charIDToTypeID( "Dplc" );
    var desc2952 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref170 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idfsel = charIDToTypeID( "fsel" );
    ref170.putProperty( idChnl, idfsel );
    desc2952.putReference( idnull, ref170 );
    var idNm = charIDToTypeID( "Nm  " );
    desc2952.putString( idNm, channel_name);
    executeAction( idDplc, desc2952, DialogModes.NO );
}

function loadSelection(channel_name) {
    var idsetd = charIDToTypeID( "setd" );
    var desc2965 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref172 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idfsel = charIDToTypeID( "fsel" );
    ref172.putProperty( idChnl, idfsel );
    desc2965.putReference( idnull, ref172 );
    var idT = charIDToTypeID( "T   " );
    var ref173 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    ref173.putName( idChnl, channel_name );
    desc2965.putReference( idT, ref173 );
    executeAction( idsetd, desc2965, DialogModes.NO );
}

function scaleSelection(factor) {
    var idTrnf = charIDToTypeID( "Trnf" );
    var desc2974 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref174 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idfsel = charIDToTypeID( "fsel" );
    ref174.putProperty( idChnl, idfsel );
    desc2974.putReference( idnull, ref174 );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc2974.putUnitDouble( idWdth, idPrc, factor );
    var idHght = charIDToTypeID( "Hght" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc2974.putUnitDouble( idHght, idPrc, factor );
    var idLnkd = charIDToTypeID( "Lnkd" );
    desc2974.putBoolean( idLnkd, true );
    executeAction( idTrnf, desc2974, DialogModes.NO );
}

function deselect() {
    var idsetd = charIDToTypeID( "setd" );
    var desc3181 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref179 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idfsel = charIDToTypeID( "fsel" );
    ref179.putProperty( idChnl, idfsel );
    desc3181.putReference( idnull, ref179 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc3181.putEnumerated( idT, idOrdn, idNone );
    executeAction( idsetd, desc3181, DialogModes.NO );
}

function intersectSelectionWithLayerContent() {
    var idIntr = charIDToTypeID( "Intr" );
    var desc3350 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref182 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idTrsp = charIDToTypeID( "Trsp" );
    ref182.putEnumerated( idChnl, idChnl, idTrsp );
    desc3350.putReference( idnull, ref182 );
    var idWith = charIDToTypeID( "With" );
    var ref183 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idfsel = charIDToTypeID( "fsel" );
    ref183.putProperty( idChnl, idfsel );
    desc3350.putReference( idWith, ref183 );
    executeAction( idIntr, desc3350, DialogModes.NO )
}


// Filter

