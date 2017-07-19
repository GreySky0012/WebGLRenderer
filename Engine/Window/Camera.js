/**
 * Created by Mercer on 2016/12/6.
 */

var Camera = {
    Ortho:1000,
    Perspective:2000,
    create:function () {
        //the real object
        var camera = {};

        var type = Camera.Ortho;

        camera.attr = {};
        //View attribute
        camera.attr.position = new Vector3([0.0,0.0,0.0]);
        camera.attr.lookAt = new Vector3([0.0,0.0,-100.0]);
        camera.attr.up = new Vector3([0.0,1.0,0.0]);
        //Ortho model attr
        camera.attr.left = -1.0;
        camera.attr.right = 1.0;
        camera.attr.bottom = -1.0;
        camera.attr.top = 1.0;
        camera.attr.o_near = 0.0;
        camera.attr.o_far = 100.0;
        //Perspective model attr
        camera.attr.fov = 90.0;
        camera.attr.aspect = 1.0;
        camera.attr.p_near = 1.0;
        camera.attr.p_far = 100.0;

        camera.getMatrix = function () {
            var pm = new Matrix4();
            if(type == this.Ortho){
                pm.setOrtho(this.attr.left,this.attr.right,this.attr.bottom,this.attr.top,this.attr.o_near,this.attr.o_far);
            }else {
                pm.setPerspective(this.attr.fov,this.attr.aspect,this.attr.p_near,this.attr.p_far);
            }
            var vm = new Matrix4();
            vm.setLookAt(this.attr.position.elements[0],this.attr.position.elements[1],this.attr.position.elements[2],this.attr.lookAt.elements[0],this.attr.lookAt.elements[1],this.attr.lookAt.elements[2],this.attr.up.elements[0],this.attr.up.elements[1],this.attr.up.elements[2]);
            pm.multiply(vm);
            return pm;
        }
        
        camera.move = function (vec) {
            this.attr.position.add(vec);
            this.attr.lookAt.add(vec);
        }
        
        camera.rotate = function (vec) {
            var mat = new Matrix4().setRotate(vec.elements[0],new Vector3(this.attr.lookAt.elements).subtract(this.attr.position).cross(this.attr.up));
            mat.rotate(vec.elements[1],this.attr.up);
            mat.rotate(vec.elements[2],this.attr.lookAt);
            this.attr.lookAt = new Matrix4(mat).multiplyVector3(this.attr.lookAt.subtract(this.attr.position)).add(this.attr.position);
            this.attr.up = mat.multiplyVector3(this.attr.up);
        }
        
        camera.setModel = function (_type) {
            type = _type;
        }
        
        camera.setLookAt = function (eyeX,eyeY,eyeZ,lookAtX,lookAtY,lookAtZ,upX,upY,upZ) {
            this.attr.position = new Vector3([eyeX,eyeY,eyeZ]);
            this.attr.lookAt = new Vector3([lookAtX,lookAtY,lookAtZ]);
            this.attr.up = new Vector3([upX,upY,upZ]);
        }

        camera.setOrtho = function(left,right,bottom,top,near,far){
            this.attr.left = left;
            this.attr.right = right;
            this.attr.bottom = bottom;
            this.attr.top = top;
            this.attr.o_near = near;
            this.attr.o_far = far;
        }

        camera.setPerspective = function(fov,aspect,near,far){
            this.attr.fov =fov;
            this.attr.aspect = aspect;
            this.attr.p_near = near;
            this.attr.p_far = far;
        }

        camera.getBackGroundPosition = function () {
            var dir = new Vector3(this.attr.lookAt.elements).subtract(this.attr.position).normalize().mult(this.attr.o_far*0.99);
            var pos = new Vector3(dir.elements).add(this.attr.position);
            if(type == this.Ortho){
                var n_up = new Vector3(this.attr.up.elements).normalize();
                var n_left = new Vector3(n_up.elements).cross(dir).normalize();
                var left_up = new Vector3(n_up.elements).mult(this.attr.top).add(new Vector3(n_left.elements).mult(-this.attr.left)).add(pos);
                var left_down = new Vector3(n_up.elements).mult(this.attr.bottom).add(new Vector3(n_left.elements).mult(-this.attr.left)).add(pos);
                var right_up = new Vector3(n_up.elements).mult(this.attr.top).add(new Vector3(n_left.elements).mult(-this.attr.right)).add(pos);
                var right_down = new Vector3(n_up.elements).mult(this.attr.bottom).add(new Vector3(n_left.elements).mult(-this.attr.right)).add(pos);
                return [left_up,left_down,right_up,right_down,dir.mult(-1)];
            }
            if(type == this.Perspective){
                var left = new Vector3(this.attr.up.elements).cross(dir).normalize().mult(this.attr.p_far*Math.tan(this.attr.fov/2));
                var up = new Vector3(this.attr.up.elements).normalize().mult(this.attr.p_far*Math.tan(this.attr.fov/2)*this.attr.aspect);
                var left_up = new Vector3(up.elements).add(left).add(pos);
                var left_down = new Vector3(left.elements).subtract(up).add(pos);
                var right_up = new Vector3(up.elements).subtract(left).add(pos);
                var right_down = new Vector3(left.elements).mult(-1).subtract(up).add(pos);
                return [left_up,left_down,right_up,right_down,dir.mult(-1)];
            }
        }

        return camera;
    }
}