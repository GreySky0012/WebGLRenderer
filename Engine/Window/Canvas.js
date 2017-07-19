/**
 * Created by Mercer on 2016/11/24.
 */
/**
 * Canvas class
 * @param canvasId:the id in html
 * @param Vshader:the vshader file name
 * @param fshader:the fshader file name
 * @constructor
 */
var Canvas = {
    create : function(canvasId,vshader,fshader) {
        //the real object
        var canvas = {};

        //the shaders of the canvas
        var VSHADER_SOURCE = null;
        var FSHADER_SOURCE = null;
        var VSHADER_SELECT = null;
        var FSHADER_SELECT = null;

        var objects;

        var backGround;

        var AmbientLightColor;

        //is the canvas enable
        canvas.enable = false;

        //the name of this canvas
        canvas.id = canvasId;

        var ambientLight;

        var cameras = [];
        cameras.push(Camera.create());

        var light = [];

        var nowCamera = 0;

        /**
         * reset the size of the canvas
         * @param width
         * @param height
         */
        canvas.setSize = function(width,height){
            this.canvas.setAttribute('width',String(width));
            this.canvas.setAttribute('height',String(height));
        };

        canvas.getSize = function () {
            var width = this.canvas.clientWidth;
            var height = this.canvas.clientHeight;
            return new Vector2([width,height]);
        };
        
        canvas.setBackGround = function (path) {
            if(!backGround){
                backGround = GameObject.create(this);
            }
            backGround.attr.texture = [
                0.0,1.0,0.0,
                0.0,0.0,0.0,
                1.0,1.0,0.0,
                1.0,0.0,0.0
            ];
            backGround.attr.indexinfo.index.push(0,1,2,3);
            backGround.attr.indexinfo.stripindex.push(0,4);
            backGround.loadTexture(path);

            setBackPos();
        };
        
        var setBackPos = function () {
            if(!backGround){
                return;
            }
            var pos = canvas.getNowCamera().getBackGroundPosition();
            backGround.attr.vertices = [];
            for (var i = 0;i<4;i++){
                for (var j = 0;j<3;j++){
                    backGround.attr.vertices.push(pos[i].elements[j]);
                }
            }
            backGround.attr.normal = [];
            for (var h = 0;h<4;h++){
                backGround.attr.normal.push(pos[4].elements[0],pos[4].elements[1],pos[4].elements[2]);
            }
        }

        canvas.add = function(object,selectable){
            objects.add(object,selectable);
        };

        canvas.removeObject = function (object) {
            return objects.removeObject(object);
        }

        canvas.vpMatrix;

        /**
         * draw the canvas on the window
         */
        canvas.draw = function () {
            if(backGround){
                setBackPos();
            }

            //data the eye position to the shader
            this.gl.uniform3fv(this.program.u_Eye,cameras[nowCamera].attr.position.elements);

            // Specify the color for clearing <canvas>
            this.gl.clearColor(1.0,0.0,0.0,0.5);

            // Clear <canvas>
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);

            //reset the vpMatrix of the object
            setVPMatrix();
            objects.draw();
        };

        /**
         * draw the selectable objects in this canvas
         * @param alpha the start alpha of this canvas
         * @return the number of the selectable objects in this canvas
         */
        canvas.drawSelect = function (alpha) {
            // Specify the color for clearing <canvas>
            this.gl.clearColor(1.0,1.0,1.0,0.0);

            // Clear <canvas>
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);

            return objects.drawSelect(alpha);
        }
        
        canvas.getSelect = function (num) {
            return objects.getSelect(num);
        }
        
        canvas.addLight = function (l) {
            if(light.length>=3){
                return false;
            }
            light.push(l);
            this.dataLight();
            return true;
        }

        canvas.setAmbientLight = function (color) {
            ambientLight = color;

            this.gl.uniform3fv(this.program.u_Gamb,color.elements);
        }

        canvas.getMainCamera = function () {
            return cameras[0];
        }
        
        canvas.addCamera = function () {
            cameras.push(Camera.create());
            return cameras.length-1;
        }

        canvas.getCamera = function (id) {
            if (id<cameras.length&&id>=0)
                return cameras[id];
            else
                return null;
        }

        canvas.setNowCamera = function (id) {
            nowCamera = id;
        }

        canvas.getNowCamera = function () {
            return cameras[nowCamera];
        }

        canvas.setPointerHide = function () {
            var c = Window.getInstance().hud.canvas;
            c.addEventListener('mousedown', function(e) {
                c.requestPointerLock();
            }, false);
        }
        
        var setVPMatrix = function () {
            canvas.vpMatrix = cameras[nowCamera].getMatrix();
        }

        // Read shader from file
        var readShaderFile = function(gl, fileName, shader) {
            Window.getInstance().ready++;
            var t = Window.getInstance().ready;
            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status !== 404) {
                    onReadShader(gl, request.responseText, shader);
                }
            }
            request.open('GET', 'Shader/'+fileName, true); // Create a request to acquire the file
            request.send();
        }

        // The shader is loaded from file
        var onReadShader = function(gl, fileString, shader) {
            if (shader == 'v') { // Vertex shader
                VSHADER_SOURCE = fileString;
            } else if (shader == 'f') { // Fragment shader
                FSHADER_SOURCE = fileString;
            } else if(shader == 'v_s'){
                VSHADER_SELECT = fileString;
            } else if(shader == 'f_s'){
                FSHADER_SELECT = fileString;
            }
            if (VSHADER_SOURCE && FSHADER_SOURCE && VSHADER_SELECT && FSHADER_SELECT){
                //create the select shader program
                canvas.selectProgram = createProgram(canvas.gl,VSHADER_SELECT,FSHADER_SELECT);
                if(!canvas.selectProgram){
                    console.log('Failed to intialize select shaders.');
                    return;
                }
                //init the attribute of the select program
                initAttrInSelect();

                //the buffers of the select program
                canvas.selectBuffers = initBuffersInSelect();

                // Initialize shaders
                if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
                    console.log('Failed to intialize shaders.');
                    return;
                }

                canvas.program = canvas.gl.program;

                //init the attrib locations
                initAttribLocation();

                //the buffers of this canvas
                canvas.buffers = initVertexBuffers();

                canvas.dataLight();

                canvas.enable = true;

                canvas.setAmbientLight(new Vector3([1.0,1.0,1.0]));
            }
            Window.getInstance().ready--;
        }

        canvas.dataLight = function () {
            var gl = this.gl;

            var lightNum = light.length;

            gl.uniform1i(gl.program.u_LightNum,lightNum);

            if(lightNum == 0)
                return;

            var lightType = [];
            var lightPosition = [];
            var lightColor = [];

            var i;
            for (i = 0;i<lightNum;i++){
                lightType.push(light[i].type);
                lightColor.push(light[i].color.elements[0],light[i].color.elements[1],light[i].color.elements[2]);
                lightPosition.push(light[i].position.elements[0],light[i].position.elements[1],light[i].position.elements[2]);
            }
            for(;i<3;i++){
                lightType.push(0);
                lightColor.push(0.0,0.0,0.0);
                lightPosition.push(0.0,0.0,0.0);
            }

            gl.uniform3fv(gl.program.u_LightType,lightType);
            gl.uniformMatrix3fv(gl.program.u_LightColor,false,lightColor);
            gl.uniformMatrix3fv(gl.program.u_LightPosition,false,lightPosition);
        }

        /**
         * init the attribute location of the select program
         */
        var initAttrInSelect = function () {
            canvas.selectProgram.a_Position = canvas.gl.getAttribLocation(canvas.selectProgram,'a_Position');
            if (canvas.selectProgram.a_Position<0){
                console.log('Failed to get the storage location of a_Position in select program');
                return;
            }

            canvas.selectProgram.u_Color = canvas.gl.getUniformLocation(canvas.selectProgram, 'u_Color');
            if (!canvas.selectProgram.u_Color){
                console.log('Failed to get the storage location of u_Color in select');
                return;
            }

            canvas.selectProgram.u_MvpMatrix = canvas.gl.getUniformLocation(canvas.selectProgram, 'u_MvpMatrix');
            if (!canvas.selectProgram.u_MvpMatrix){
                console.log('Failed to get the storage location of u_MvpMatrix in select mode');
                return;
            }
        }

        /**
         * init the attribute Location of the normal program
         */
        var initAttribLocation = function() {
            canvas.program.a_Position = canvas.gl.getAttribLocation(canvas.program,'a_Position');
            if (canvas.program.a_Position<0){
                console.log('Failed to get the storage location of a_Position');
                return;
            }

            canvas.program.a_Normal = canvas.gl.getAttribLocation(canvas.program,'a_Normal');
            if (canvas.program.a_Normal<0){
                console.log('Failed to get the storage location of a_Normal');
                return;
            }

            canvas.program.a_TexCoord = canvas.gl.getAttribLocation(canvas.program,'a_TexCoord');
            if (canvas.program.a_TexCoord<0){
                console.log('Failed to get the storage location of a_TexCoord');
                return;
            }

            canvas.program.u_MvpMatrix = canvas.gl.getUniformLocation(canvas.program, 'u_MvpMatrix');
            if (!canvas.program.u_MvpMatrix){
                console.log('Failed to get the storage location of u_MvpMatrix');
                return;
            }

            canvas.program.u_NormalMatrix = canvas.gl.getUniformLocation(canvas.program, 'u_NormalMatrix');
            if (!canvas.program.u_NormalMatrix){
                console.log('Failed to get the storage location of u_NormalMatrix');
                return;
            }

            canvas.program.u_Eye = canvas.gl.getUniformLocation(canvas.program, 'u_Eye');
            if (!canvas.program.u_Eye){
                console.log('Failed to get the storage location of u_Eye');
                return;
            }

            canvas.program.u_LightType = canvas.gl.getUniformLocation(canvas.program,'u_LightType');
            if (!canvas.program.u_LightType){
                console.log('Failed to get the storage location of u_LightType');
                return;
            }

            canvas.program.u_LightColor = canvas.gl.getUniformLocation(canvas.program,'u_LightColor');
            if (!canvas.program.u_LightColor){
                console.log('Failed to get the storage location of u_LightColor');
                return;
            }

            canvas.program.u_LightPosition = canvas.gl.getUniformLocation(canvas.program,'u_LightPosition');
            if (!canvas.program.u_LightPosition){
                console.log('Failed to get the storage location of u_LightPosition');
                return;
            }

            canvas.program.u_Gamb = canvas.gl.getUniformLocation(canvas.program,'u_Gamb');
            if (!canvas.program.u_Gamb){
                console.log('Failed to get the storage location of u_Gamb');
                return;
            }

            canvas.program.u_LightNum = canvas.gl.getUniformLocation(canvas.program,'u_LightNum');
            if (!canvas.program.u_LightNum){
                console.log('Failed to get the storage location of u_LightNum');
                return;
            }

            canvas.program.u_Mgls = canvas.gl.getUniformLocation(canvas.program,'u_Mgls');
            if (!canvas.program.u_Mgls){
                console.log('Failed to get the storage location of u_Mgls');
                return;
            }

            canvas.program.u_Ka = canvas.gl.getUniformLocation(canvas.program,'u_Ka');
            if (!canvas.program.u_Ka){
                console.log('Failed to get the storage location of u_Ka');
                return;
            }

            canvas.program.u_Ks = canvas.gl.getUniformLocation(canvas.program,'u_Ks');
            if (!canvas.program.u_Ks){
                console.log('Failed to get the storage location of u_Ks');
                return;
            }

            canvas.program.u_Kd = canvas.gl.getUniformLocation(canvas.program,'u_Kd');
            if (!canvas.program.u_Kd){
                console.log('Failed to get the storage location of u_Kd');
                return;
            }

            canvas.program.u_d = canvas.gl.getUniformLocation(canvas.program,'u_d');
            if (!canvas.program.u_d){
                console.log('Failed to get the storage location of u_d');
                return;
            }

            canvas.program.u_Sampler = canvas.gl.getUniformLocation(canvas.program,'u_Sampler');
            if(!canvas.program.u_Sampler){
                console.log('Failed to get the storage location of u_Sampler');
                return;
            }

            canvas.program.u_IsTexture = canvas.gl.getUniformLocation(canvas.program, 'u_IsTexture');
            if (!canvas.program.u_IsTexture){
                console.log('Failed to get the storage location of u_IsTexture');
                return;
            }
        }

        /**
         * create an buffer object and initial configuration
         */
        var initBuffersInSelect = function () {
            var o = new Object(); // Utilize Object object to return multiple buffer objects
            o.vertexBuffer = createEmptyArrayBuffer(canvas.gl, canvas.selectProgram.a_Position, 3, canvas.gl.FLOAT);
            o.indexBuffer = canvas.gl.createBuffer();
            if (!o.vertexBuffer || !o.indexBuffer) { return null; }

            canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, null);

            return o;
        }

        // Create an buffer object and perform an initial configuration
        var initVertexBuffers = function() {
            var o = new Object(); // Utilize Object object to return multiple buffer objects
            o.vertexBuffer = createEmptyArrayBuffer(canvas.gl, canvas.program.a_Position, 3, canvas.gl.FLOAT);
            o.normalBuffer = createEmptyArrayBuffer(canvas.gl, canvas.program.a_Normal, 3, canvas.gl.FLOAT);
            o.texBuffer = createEmptyArrayBuffer(canvas.gl,canvas.program.a_TexCoord,3,canvas.gl.FLOAT);
            o.indexBuffer = canvas.gl.createBuffer();
            if (!o.vertexBuffer || !o.normalBuffer|| !o.texBuffer || !o.indexBuffer) { return null; }

            canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, null);

            return o;
        }

        // Create a buffer object, assign it to attribute variables, and enable the assignment
        var createEmptyArrayBuffer = function(gl, a_attribute, num, type) {
            var buffer =  gl.createBuffer();  // Create a buffer object
            if (!buffer) {
                console.log('Failed to create the buffer object');
                return null;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
            gl.enableVertexAttribArray(a_attribute);  // Enable the assignment

            return buffer;
        }

        canvas.init = function () {
            //the id in html of the canvas
            this.canvas = document.getElementById(this.id);

            //the gl of this canvas
            this.gl = getWebGLContext(this.canvas);

            this.gl.enable(this.gl.DEPTH_TEST);

            //The shader of canvas
            readShaderFile(this.gl,vshader,'v');
            readShaderFile(this.gl,fshader,'f');
            readShaderFile(this.gl,'VShader_Select.vert','v_s');
            readShaderFile(this.gl,'FShader_Select.frag','f_s');

            objects  = ObjectManager.create(this);
        };

        return canvas;
    }
}



