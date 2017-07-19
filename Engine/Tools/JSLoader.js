/**
 * Created by Mercer on 2016/11/30.
 */

var loadNum = 0;

var loadJSFile = function(path,src){
    loadNum++;

    var body = document.body;
    var script= document.createElement("script");
    script.type = "text/javascript";
    script.src= path+'/'+src+'.js';
    body.appendChild(script);

    script.onload = function () {
        loadNum -- ;
    }
}