/**
 * Created by Mercer on 2016/11/28.
 */

/**
 * The attr of a gameobject
 * @type {{}}
 */
var ObjectAttr = {
    create:function () {
        var attr = {};

        attr.texturePath = "";
        attr.matrix = new Matrix4();
        attr.position = new Vector3([0.0,0.0,0.0]);
        attr.towards = new Vector3([0.0,1.0,0.0]);
        attr.vertices = [];
        attr.normal = [];
        attr.texture = [];
        attr.indexinfo = {};
        attr.indexinfo.index = [];
        attr.indexinfo.stripindex = [];
        attr.indexinfo.fanindex = [];
        attr.indexinfo.triangle = [];
        attr.rotate = new Vector3([0.0,0.0,0.0]);
        attr.material = Material.create();

        attr.clone = function(a){
            this.texturePath = a;
            this.matrix = new Matrix4(a.matrix);
            this.position = new Vector3(a.position.elements);
            this.towards = new Vector3(a.towards.elements);
            this.vertices = a.vertices.slice(0);
            this.normal = a.normal.slice(0);
            this.texture = a.texture.slice(0);
            this.indexinfo = {};
            this.indexinfo.index = a.indexinfo.index.slice(0);
            this.indexinfo.stripindex = a.indexinfo.stripindex.slice(0);
            this.indexinfo.fanindex = a.indexinfo.fanindex.slice(0);
            this.indexinfo.triangle = a.indexinfo.triangle.slice(0);
            this.rotate = new Vector3(a.rotate.elements);
            this.material = Material.create().clone(a.material);

            return this;
        }

        return attr;
    }
}