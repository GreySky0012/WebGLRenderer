/**
 * Created by 53017_000 on 2016/12/20.
 */

//------------------------------------------------------------------------------
// MTLDoc Object
//------------------------------------------------------------------------------
var MTLDoc = function() {
    this.complete = false; // MTL is configured correctly
    this.materials = new Array(0);
    this.names = new Array(0);
}

MTLDoc.prototype.parseNewmtl = function(sp) {
    return sp.getWord();         // Get name
}

MTLDoc.prototype.parseRGB = function(sp) {
    var r = sp.getFloat();
    var g = sp.getFloat();
    var b = sp.getFloat();
    return new Vector3([r, g, b]);
}

MTLDoc.prototype.parseFloat = function(sp) {
    var f = sp.getFloat();
    return f;
}

// Analyze the material file
function onReadMTLFile(fileString, mtl) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null);           // Append null
    var index = 0;              // Initialize index of line

    var currentMaterial = 0;

    // Parse line by line
    var line;      // A string in the line to be parsed
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
        sp.init(line);                  // init StringParser
        var command = sp.getWord();     // Get command
        if(command == null)	 continue;  // check null command

        switch(command){
            case '#':
                continue;    // Skip comments
            case 'newmtl': // Read Material chunk
                mtl.names.push(mtl.parseNewmtl(sp));    // Get name
                currentMaterial = mtl.materials.length;
                mtl.materials.push(Material.create());
                continue; // Go to the next line
            case 'Kd':   // Read normal
                mtl.materials[currentMaterial].m_Kd = mtl.parseRGB(sp);
                continue; // Go to the next line
            case 'Ka':
                mtl.materials[currentMaterial].m_Ka = mtl.parseRGB(sp);
                continue; // Go to the next line
            case 'Ks':
                mtl.materials[currentMaterial].m_Ks = mtl.parseRGB(sp);
                continue; // Go to the next line
            case 'Ns':
                mtl.materials[currentMaterial].m_gls = mtl.parseFloat(sp);
                continue; // Go to the next line
            case 'd':
                mtl.materials[currentMaterial].d = mtl.parseFloat(sp);
                continue;
        }
    }
    mtl.complete = true;
}