/**
 * Created by 53017_000 on 2016/12/31.
 */

/**
 * Created by Mercer on 2016/12/1.
 */

var Cube = {
    create: function (canvas,selectable) {
        var cube = GameObject.create(canvas,selectable);

        cube.x = 1;
        cube.y = 1;
        cube.z = 1;

        cube.setSize = function (size) {
            this.scale(new Vector3([size.elements[0]/this.x,size.elements[1]/this.y,size.elements[2]/this.z]));
            this.x = size.elements[0];
            this.y = size.elements[1];
            this.z = size.elements[2];
        }

        var setVertice=function () {
            cube.attr.vertices.push(
                -0.5,0.5,0.5,
                -0.5,-0.5,0.5,
                0.5,0.5,0.5,
                0.5,-0.5,0.5,
                -0.5,0.5,-0.5,
                -0.5,-0.5,-0.5,
                0.5,0.5,-0.5,
                0.5,-0.5,-0.5
            );
            cube.attr.normal.push(
                -1,1,1,
                -1,-1,1,
                1,1,1,
                1,-1,1,
                -1,1,-1,
                -1,-1,-1,
                1,1,-1,
                1,-1,-1
            );
            cube.attr.indexinfo.index.push(
                0,1,2,3,
                2,3,6,7,
                6,7,4,5,
                4,5,0,1,
                0,2,4,6,
                3,1,7,5
            );
            cube.attr.indexinfo.stripindex.push(0,4,4,4,8,4,12,4,16,4,20,4);
        }

        var init = function () {
            setVertice();
        }();

        return cube;
    }
}