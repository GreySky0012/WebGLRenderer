/**
 * Created by 53017_000 on 2016/12/20.
 */

var OBJObject = {
    create:function (canvas,path,scale,reverse,selectable) {
        var object = readFile(path,canvas,scale,reverse,selectable);

        var src = path;

        return object;
    }
}