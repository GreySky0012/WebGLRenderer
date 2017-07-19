/**
 * Created by Mercer on 2016/12/6.
 */

var Circle = {
    create: function (canvas,selectable) {
        var circle = GameObject.create(canvas,selectable);

        circle.r = 1;

        circle.setR = function (radius) {
            this.scale(new Vector3([radius/this.r,radius/this.r,radius/this.r]));
            this.r = radius;
        }

        var setVertice=function () {
            var w=60;
            var step=360.0/w;
            circle.attr.vertices.push(0.0,0.0,0.0);
            for (var a = 0.0, j = 0; j < w; j++, a += step) {
                var _x=circle.r*Math.sin(a*Math.PI/180.0);
                var _y=circle.r*Math.cos(a*Math.PI/180.0);
                circle.attr.vertices.push(_x,_y,0.0);
            }
            circle.attr.vertices.push(0.0,1.0,0.0);

            for(var i = 0;i<circle.attr.vertices.length;i++){
                circle.attr.normal.push(0.0,0.0,1.0);
            }

            circle.attr.indexinfo.fanindex.push(0);
            circle.attr.indexinfo.index.push(0);
            for(var c = 0;c<w;c++){
                circle.attr.indexinfo.index.push(c+1);
            }
            circle.attr.indexinfo.index.push(1);
            circle.attr.indexinfo.fanindex.push(w+2);
        }

        var init = function () {
            setVertice();
        }();

        return circle;
    }
}