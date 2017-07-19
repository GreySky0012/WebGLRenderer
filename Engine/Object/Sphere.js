/**
 * Created by Mercer on 2016/12/1.
 */

var Sphere = {
    create: function (canvas,selectable) {
        var sphere = GameObject.create(canvas,selectable);

        sphere.r = 1;
        
        sphere.setR = function (radius) {
            this.scale(new Vector3([radius/this.r,radius/this.r,radius/this.r]));
            this.r = radius;
        }

        var setVertice=function () {
            var i,j,w=60,h=30;
            var a=0.0,b=0.0;
            var hStep=180.0/h;
            var wStep=360.0/w;
            sphere.attr.vertices.push(0.0,1.0,0.0);
            sphere.attr.normal.push(0.0,1.0,0.0);
            for(a=hStep,i=1;i<h;i++,a+=hStep) {
                for (b = 0.0, j = 0; j < w; j++, b += wStep) {
                    var _x=sphere.r*Math.sin(a*Math.PI/180.0)*Math.cos(b*Math.PI/180.0);
                    var _z=sphere.r*Math.sin(a*Math.PI/180.0)*Math.sin(b*Math.PI/180.0);
                    var _y=sphere.r*Math.cos(a*Math.PI/180.0);
                    sphere.attr.vertices.push(_x,_y,_z);
                    sphere.attr.normal.push(_x,_y,_z);
                }
            }
            sphere.attr.vertices.push(0.0,-1.0,0.0);
            sphere.attr.normal.push(0.0,-1.0,0.0);

            sphere.attr.indexinfo.index.push(0);
            sphere.attr.indexinfo.fanindex.push(0);
            for(var c = 0;c<w;c++){
                sphere.attr.indexinfo.index.push(c+1);
            }
            sphere.attr.indexinfo.index.push(1);
            sphere.attr.indexinfo.fanindex.push(w+2);

            sphere.attr.indexinfo.fanindex.push(sphere.attr.indexinfo.index.length);
            sphere.attr.indexinfo.index.push(w*(h-1)+1);
            for(var c = 0;c<w;c++){
                sphere.attr.indexinfo.index.push(w*(h-2)+c+1);
            }
            sphere.attr.indexinfo.index.push(w*(h-2)+1);
            sphere.attr.indexinfo.fanindex.push(w+2);

            for(var c = 0;c<h-2;c++){
                sphere.attr.indexinfo.stripindex.push(sphere.attr.indexinfo.index.length);
                sphere.attr.indexinfo.stripindex.push(2*w+2);

                for(var d = 0;d<w;d++){
                    sphere.attr.indexinfo.index.push(1+c*w+d);
                    sphere.attr.indexinfo.index.push(1+c*w+w+d);
                }

                sphere.attr.indexinfo.index.push(1+c*w+0);
                sphere.attr.indexinfo.index.push(1+c*w+w+0);
            }
        }

        var init = function () {
            setVertice();
        }();

        return sphere;
    }
}