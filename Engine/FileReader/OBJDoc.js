/**
 * Created by 53017_000 on 2016/12/20.
 */

var OBJDoc = function (fileName,canvas,object) {
    this.canvas = canvas;
    this.fileName = fileName;
    this.object = object;

    this.build = false;//is build already
    this.isTexture = false;//is texture info in the OBJ file

    this.objects = new Array(0);    //the data of each child
    this.childern = new Array(0);    //the childern of the gameobject
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal
    this.textures = new Array(0);  //Initialize the property for Texture
}

// Check Materials
OBJDoc.prototype.isMTLComplete = function() {
    if(this.mtls.length == 0) return true;
    for(var i = 0; i < this.mtls.length; i++){
        if(!this.mtls[i].complete) return false;
    }
    return true;
}

// Parsing the OBJ file
OBJDoc.prototype.parse = function(fileString, scale, reverse) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null); // Append null
    var index = 0;    // Initialize index of line

    var currentMaterialName = "";
    var currentObject;

    // Parse line by line
    var line;         // A string in the line to be parsed
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
        sp.init(line);                  // init StringParser
        var command = sp.getWord();     // Get command
        if(command == null)	 continue;  // check null command

        switch(command){
            case '#':
                continue;  // Skip comments
            case 'mtllib':     // Read Material chunk
                var path = this.parseMtllib(sp, this.fileName);
                var mtl = new MTLDoc();   // Create MTL instance
                this.mtls.push(mtl);
                var request = new XMLHttpRequest();
                var doc = this;
                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        if (request.status != 404) {
                            onReadMTLFile(request.responseText, mtl);
                        }else{
                            mtl.complete = true;
                        }
                    }
                    if (doc.isMTLComplete()&&!doc.build){
                        doc.buildObject();
                    }
                }
                request.open('GET', path, true);  // Create a request to acquire the file
                request.send();                   // Send the request
                continue; // Go to the next line
            case 'o':
            case 'g':   // Read Object name
                continue; // Go to the next line
            case 'v':   // Read vertex
                var vertex = this.parseVertex(sp, scale);
                this.vertices.push(vertex);
                continue; // Go to the next line
            case 'vn':   // Read normal
                var normal = this.parseNormal(sp);
                this.normals.push(normal);
                continue; // Go to the next line
            case 'vt':   //Read texture
                var texture = this.parseTexture(sp);
                this.textures.push(texture);
                continue;
            case 'usemtl': // Read Material name
                currentMaterialName = this.parseUsemtl(sp);
                var object = new child();
                this.objects.push(object);
                currentObject = object;
                continue; // Go to the next line
            case 'f': // Read face
                var face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
                currentObject.faces.push(face);
                currentObject.numIndices += face.numIndices;
                continue; // Go to the next line
        }
    }

    if(this.isMTLComplete()&&!this.build){
        this.buildObject();
    }
    return true;
}

OBJDoc.prototype.buildObject = function () {
    this.build = true;

    //get the path of texture
    if(this.isTexture){
        var texturePath = this.getTexturePath(this.fileName);
    }

    // Create an arrays for vertex coordinates, normals, colors, and indices
    var currentObject;
    for(var i = 0; i < this.objects.length; i++){

        // Set vertex, normal and color
        var index_indices = 0;

        currentObject = GameObject.create(this.canvas);

        var object = this.objects[i];
        for(var j = 0; j < object.faces.length; j++){
            var face = object.faces[j];
            currentObject.attr.material = this.findMaterial(face.materialName);
            var faceNormal = face.normal.elements;
            for(var k = 0; k < face.vIndices.length; k++){
                // Set index
                currentObject.attr.indexinfo.index.push(index_indices);
                // Copy vertex
                var vIdx = face.vIndices[k];
                var vertex = this.vertices[vIdx].elements;
                currentObject.attr.vertices.push(vertex[0],vertex[1],vertex[2]);
                // Copy normal
                var nIdx = face.nIndices[k];
                if(nIdx >= 0){
                    var normal = this.normals[nIdx].elements;
                    currentObject.attr.normal.push(normal[0],normal[1],normal[2]);
                }else{
                    currentObject.attr.normal.push(faceNormal[0],faceNormal[1],faceNormal[2]);
                }
                if(this.isTexture){
                    var tIdx = face.tIndices[k];
                    var texture = this.textures[tIdx].elements;
                    currentObject.attr.texture.push(texture[0],texture[1],texture[2]);
                }
                index_indices ++;
            }
        }
        currentObject.attr.indexinfo.triangle.push(0);
        currentObject.attr.indexinfo.triangle.push(currentObject.attr.indexinfo.index.length);
        if(this.isTexture){
            currentObject.loadTexture(texturePath);
        }
        currentObject.setPosition(this.object.attr.position);
        this.object.addChild(currentObject);
    }

    this.object.enable = true;
}

OBJDoc.prototype.parseMtllib = function(sp, fileName) {
    // Get directory path
    var i = fileName.lastIndexOf("/");
    var dirPath = "";
    if(i > 0) dirPath = fileName.substr(0, i+1);

    return dirPath + sp.getWord();   // Get path
}

OBJDoc.prototype.getTexturePath = function (fileName) {
    var i = fileName.lastIndexOf(".");
    var dirPath = "";
    dirPath = fileName.substr(0,i+1);

    return dirPath+"jpg";
}

OBJDoc.prototype.parseVertex = function(sp, scale) {
    var x = sp.getFloat() * scale;
    var y = sp.getFloat() * scale;
    var z = sp.getFloat() * scale;
    return (new Vector3([x, y, z]));
}

OBJDoc.prototype.parseNormal = function(sp) {
    var x = sp.getFloat();
    var y = sp.getFloat();
    var z = sp.getFloat();
    return (new Vector3([x, y, z]));
}

OBJDoc.prototype.parseTexture = function (sp) {
    var x = sp.getFloat();
    var y = sp.getFloat();
    var z = sp.getFloat();
    return (new Vector3([x, y, z]));
}

OBJDoc.prototype.parseUsemtl = function(sp) {
    return sp.getWord();
}

OBJDoc.prototype.parseFace = function(sp, materialName, vertices, reverse) {
    var face = new Face(materialName);
    // get indices
    for(;;){
        var word = sp.getWord();
        if(word == null) break;
        var subWords = word.split('/');
        if(subWords.length >= 1){
            var vi = parseInt(subWords[0]) - 1;
            face.vIndices.push(vi);
        }
        if(subWords.length >= 3){
            this.isTexture = true;
            var ni = parseInt(subWords[2]) - 1;
            face.nIndices.push(ni);
            var ti = parseInt(subWords[1]) - 1;
            face.tIndices.push(ti);
        }else{
            face.nIndices.push(-1);
            face.tIndices.push(-1);
        }
    }

    // calc normal
    var v0 = [
        vertices[face.vIndices[0]].elements[0],
        vertices[face.vIndices[0]].elements[1],
        vertices[face.vIndices[0]].elements[2]];
    var v1 = [
        vertices[face.vIndices[1]].elements[0],
        vertices[face.vIndices[1]].elements[1],
        vertices[face.vIndices[1]].elements[2]];
    var v2 = [
        vertices[face.vIndices[2]].elements[0],
        vertices[face.vIndices[2]].elements[1],
        vertices[face.vIndices[2]].elements[2]];

    var normal = calcNormal(v0, v1, v2);
    if (normal == null) {
        if (face.vIndices.length >= 4) { // cal the normal of rect
            var v3 = [
                vertices[face.vIndices[3]].x,
                vertices[face.vIndices[3]].y,
                vertices[face.vIndices[3]].z];
            normal = calcNormal(v1, v2, v3);
        }
        if(normal == null){
            normal = [0.0, 1.0, 0.0];
        }
    }
    if(reverse){
        normal[0] = -normal[0];
        normal[1] = -normal[1];
        normal[2] = -normal[2];
    }
    face.normal = new Vector3([normal[0], normal[1], normal[2]]);

    // Devide to triangles if face contains over 3 points.
    if(face.vIndices.length > 3){
        var n = face.vIndices.length - 2;
        var newVIndices = new Array(n * 3);
        var newNIndices = new Array(n * 3);
        for(var i=0; i<n; i++){
            newVIndices[i * 3 + 0] = face.vIndices[0];
            newVIndices[i * 3 + 1] = face.vIndices[i + 1];
            newVIndices[i * 3 + 2] = face.vIndices[i + 2];
            newNIndices[i * 3 + 0] = face.nIndices[0];
            newNIndices[i * 3 + 1] = face.nIndices[i + 1];
            newNIndices[i * 3 + 2] = face.nIndices[i + 2];
        }
        face.vIndices = newVIndices;
        face.nIndices = newNIndices;
    }
    face.numIndices = face.vIndices.length;

    return face;
}

// Find material by material name
OBJDoc.prototype.findMaterial = function(name){
    for(var i = 0; i < this.mtls.length; i++){
        for(var j = 0; j < this.mtls[i].materials.length; j++){
            var n = encodeURIComponent(this.mtls[i].names[j]);
            var m = encodeURIComponent(name);
            if(this.mtls[i].names[j] == name){
                return(this.mtls[i].materials[j])
            }
        }
    }
    return Material.create();
}

//------------------------------------------------------------------------------
// Child Object
//------------------------------------------------------------------------------
var child = function () {
    this.faces = new Array(0);
    this.numIndices = 0;
}

//------------------------------------------------------------------------------
// Face Object
//------------------------------------------------------------------------------
var Face = function(materialName) {
    this.materialName = materialName;
    if(materialName == null)  this.materialName = "";
    this.vIndices = new Array(0);
    this.nIndices = new Array(0);
    this.tIndices = new Array(0);
}

//------------------------------------------------------------------------------
// Common function
//------------------------------------------------------------------------------
function calcNormal(p0, p1, p2) {
    // v0: a vector from p1 to p0, v1; a vector from p1 to p2
    var v0 = new Float32Array(3);
    var v1 = new Float32Array(3);
    for (var i = 0; i < 3; i++){
        v0[i] = p0[i] - p1[i];
        v1[i] = p2[i] - p1[i];
    }

    // The cross product of v0 and v1
    var c = new Float32Array(3);
    c[0] = v0[1] * v1[2] - v0[2] * v1[1];
    c[1] = v0[2] * v1[0] - v0[0] * v1[2];
    c[2] = v0[0] * v1[1] - v0[1] * v1[0];

    // Normalize the result
    var v = new Vector3(c);
    v.normalize();
    return v.elements;
}