/**
 * Created by Mercer on 2016/11/28.
 */


/**
 * The gameobject class,root class of all object in canvas
 * @type {{create: GameObject.create}}
 */
var GameObject = {
    create: function (canvas,selectable) {
        var gameObject = {};

        canvas.add(gameObject);

        gameObject.attr = ObjectAttr.create();
        gameObject.parent;
        gameObject.childern = [];

        gameObject.canvas = canvas;
        gameObject.id;//the id the this object

        gameObject.isTexture = false;
        gameObject.image = new Image();
        gameObject.texture = canvas.gl.createTexture();

        gameObject.enable = true;
        gameObject.selectable = false;//is the object able to be selected
        if(selectable){
            gameObject.selectable = selectable;
        }

        /**
         * clone from another gameobjet
         * @param obj
         */
        gameObject.clone = function(obj){
            this.attr = ObjectAttr.create().clone(obj.attr);
            gameObject.parent = obj.parent;
            this.childern = [];
            for(var i = 0;i<this.childern.length;i++){
                this.childern.push(GameObject.create(canvas).clone(obj.childern[i]));
            }

            this.canvas = obj.canvas;
            this.isTexture = obj.isTexture;
            this.image = obj.image;
            this.texture = obj.texture;
            this.enable = obj.enable;

            return this;
        }

        gameObject.removeFromCanvas = function () {
            for(var i = 0;i<this.childern.length;i++){
                this.childern[i].removeFromCanvas();
            }
            return this.canvas.removeObject(this);
        }

        gameObject.getPosition = function () {
            if(this.parent)
                return this.parent.getPosition().add(this.attr.position);
            else
                return new Vector3(this.attr.position.elements);
        }
        
        gameObject.getRotate = function () {
            if (this.parent)
                return this.parent.getRotate().add(this.attr.rotate);
            else
                return new Vector3(this.attr.rotate.elements);
        }
        
        gameObject.getMatrix = function () {
            if (this.parent){
                return this.parent.getMatrix().multiply(this.attr.matrix);
            }
            else
                return new Matrix4(this.attr.matrix);
        }
        
        gameObject.getLocalMatrix = function () {
            return new Matrix4(this.attr.matrix);
        }

        gameObject.setParent = function(parent){
            this.removeFromParent();
            if (parent) {
                this.attr.position.subtract(parent.getPosition());
                this.attr.rotate.subtract(parent.attr.rotate);
                this.attr.matrix = parent.getMatrix().invert().multiply(this.attr.matrix);
            }
            this.parent = parent;
        }

        gameObject.removeFromParent = function(){
            this.attr.position = this.getPosition();
            this.attr.rotate = this.getRotate();
            this.matrix = this.getMatrix();
            this.parent = null;
        }

        gameObject.addChild = function (child) {
            if(child == null)
                return;
            this.childern.push(child);
            child.setParent(this);
        }

        gameObject.moveBy = function (vec) {
            var m = new Matrix4().setTranslate(vec);
            this.attr.matrix = m.multiply(this.attr.matrix);
            /*m.multiply(this.getMatrix());
            if(this.parent){
                this.attr.matrix = this.parent.getMatrix().invert().multiply(m);
            }
            else {
                this.attr.matrix = m;
            }*/

            this.addPosition(vec);
        };

        gameObject.addPosition = function(vec){
            this.attr.position.add(vec);
            for(var i = 0;i<this.childern.length;i++){
                this.childern[i].addPosition(vec);
            }
        }

        gameObject.scale = function (vec) {
            var m = new Matrix4().setScale(vec);
            this.attr.matrix.multiply(m);
            /*m.multiply(this.getMatrix());
            if(this.parent){
                this.attr.matrix = this.parent.getMatrix().invert().multiply(m);
            }
            else {
                this.attr.matrix = m;
            }*/
        };

        gameObject.rotate = function (theta) {
            var m = new Matrix4().setRotateXYZ(theta);
            this.attr.matrix.multiply(m);

            this.attr.rotate.add(theta);
        };

        /*gameObject.addRotate = function (theta) {
            this.attr.rotate.add(theta);
            for(var i = 0;i<this.childern.length;i++){
                this.childern[i].addRotate(theta);
            }
        };*/

        gameObject.setPosition = function(position){
            var mov = new Vector3(position.elements).subtract(this.getPosition());
            this.moveBy(mov);
        };

        gameObject.setColor = function (color) {
            if(color.type == "Vector4"){
                var color3 = new Vector3([color.elements[0],color.elements[1],color.elements[2]]);
                this.attr.material.m_Ka = color3;
                this.attr.material.m_Kd = color3;
                this.attr.material.m_Ks = color3;
                this.attr.material.d = color.elements[0];
            }

            if(color.type == "Vector3"){
                this.attr.material.m_Ka = color;
                this.attr.material.m_Kd = color;
                this.attr.material.m_Ks = color;
            }
        };
        
        gameObject.setMaterial = function (material) {
            this.attr.material = material;
        };
        
        gameObject.loadTexture = function (path) {
            var o = this;
            this.isTexture = true;
            this.image = new Image();
            this.enable = false;
            this.attr.texturePath = path;
            this.image.onload = function () {
                o.enable = true;
            }
            this.image.src = path;
        }

        return gameObject;
    }
};