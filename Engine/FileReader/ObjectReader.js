/**
 * Created by 53017_000 on 2016/12/20.
 */

var readFile = function (path,canvas,scale,reverse,selectable) {
    var object = GameObject.create(canvas,selectable);
    object.enable = false;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            setObject(request.responseText, path, canvas, scale, reverse,object);
        }
    }

    request.open('GET',path,true);
    request.send();

    return object;
}

var setObject = function (fileString, fileName, canvas, scale, reverse,object) {
    var objDoc = new OBJDoc(fileName,canvas,object);
    var result = objDoc.parse(fileString,scale,reverse);
}