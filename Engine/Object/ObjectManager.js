/**
 * Created by Mercer on 2016/11/28.
 */

/**
 * the manager of gameobjects in a canvas
 * @type {{create: ObjectManager.create}}
 */
var ObjectManager={
    create:function (canvas) {
        var manager = {};

        var objects = [];
        var selects = [];

        var selectMode = 2000;
        var normalMode = 2001;

        var nowAlpha = 0.0;//the current alpha value in select mode

        var drawModel = normalMode;

        manager.canvas = canvas;
        
        manager.draw = function () {
            for(var i = 0;i<objects.length;i++){
                if(objects[i].enable)
                    drawObject(objects[i])
            }
        }

        /**
         * draw the selectable objects in this manager
         * @param alpha is the start alpha of the color in this objectManager
         * @return the number of selectable objects in this manager
         */
        manager.drawSelect = function (alpha) {
            nowAlpha = alpha;
            this.canvas.gl.useProgram(this.canvas.selectProgram);
            fillSelects();
            drawModel = selectMode;
            for(var i = 0;i<selects.length;i++){
                drawWithChildren(selects[i]);
                nowAlpha+=1;
            }
            drawModel = normalMode;
            this.canvas.gl.useProgram(this.canvas.program);
            return selects.length;
        }

        /**
         * draw the object with its children in the select mode
         * @param object
         */
        var drawWithChildren = function(object){
            if(object.enable){
                drawObject(object);
                for (var i = 0;i<object.childern.length;i++){
                    drawWithChildren(object.childern[i]);
                }
            }
        }

        manager.getSelect = function (num) {
            if(num>=selects.length)
                return null;
            return selects[num];
        }

        /**
         * refill the select array
         */
        var fillSelects = function () {
            selects = [];
            for(var i = 0;i<objects.length;i++){
                if(objects[i].selectable){
                    selects.push(objects[i]);
                }
            }
        }
        
        var drawObject = function(object){
            var gl = manager.canvas.gl;
            dataObject(object);
            for(var a = 0;a<object.attr.indexinfo.fanindex.length/2;a++){
                gl.drawElements(gl.TRIANGLE_FAN,object.attr.indexinfo.fanindex[a*2+1],gl.UNSIGNED_SHORT,object.attr.indexinfo.fanindex[a*2]*2);
            }
            for(var a = 0;a<object.attr.indexinfo.stripindex.length/2;a++){
                gl.drawElements(gl.TRIANGLE_STRIP,object.attr.indexinfo.stripindex[a*2+1],gl.UNSIGNED_SHORT,object.attr.indexinfo.stripindex[a*2]*2);
            }
            for(var a = 0;a<object.attr.indexinfo.triangle.length/2;a++){
                gl.drawElements(gl.TRIANGLES,object.attr.indexinfo.triangle[a*2+1],gl.UNSIGNED_SHORT,object.attr.indexinfo.triangle[a*2]*2);
            }
        }

        var dataObject = function (object) {
            var gl = manager.canvas.gl;
            //Write data in select mode
            if(drawModel == selectMode){
                gl.bindBuffer(gl.ARRAY_BUFFER,manager.canvas.selectBuffers.vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(object.attr.vertices),gl.STREAM_DRAW);

                // Write the indices to the buffer object
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, manager.canvas.selectBuffers.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.attr.indexinfo.index), gl.STREAM_DRAW);

                gl.uniform4fv(manager.canvas.selectProgram.u_Color,[nowAlpha/255,0.0,0.0,1.0]);

                //write the model matrix of the object to the shader
                var modelMatrix = object.getMatrix();
                var mvpMatrix = new Matrix4(manager.canvas.vpMatrix);
                mvpMatrix.multiply(modelMatrix);
                gl.uniformMatrix4fv(canvas.selectProgram.u_MvpMatrix,false,mvpMatrix.elements);
            }else {
                // Write date into the buffer object in normal mode
                gl.bindBuffer(gl.ARRAY_BUFFER,manager.canvas.buffers.vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(object.attr.vertices),gl.STREAM_DRAW);

                //try to calculate normal in shader
                gl.bindBuffer(gl.ARRAY_BUFFER, manager.canvas.buffers.normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.attr.normal), gl.STREAM_DRAW);

                // Write the indices to the buffer object
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, manager.canvas.buffers.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.attr.indexinfo.index), gl.STREAM_DRAW);

                if(object.isTexture){
                    // Write the texture to the buffer object
                    gl.bindBuffer(gl.ARRAY_BUFFER, manager.canvas.buffers.texBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.attr.texture), gl.STREAM_DRAW);

                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
                    // Enable texture unit0
                    gl.activeTexture(gl.TEXTURE0);
                    // Bind the texture object to the target
                    gl.bindTexture(gl.TEXTURE_2D, object.texture);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    // Set the texture parameters
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    // Set the texture image
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, object.image);

                    // Set the texture unit 0 to the sampler
                    gl.uniform1i(manager.canvas.program.u_Sampler, 0);
                }else {
                    //weite some thing as the texture of the object
                    var virtualTexture = [];
                    for(var i = 0;i<object.attr.vertices.length;i++){
                        virtualTexture.push(0.0);
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER, manager.canvas.buffers.texBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(virtualTexture), gl.STREAM_DRAW);
                }

                //write the model matrix of the object to the shader
                var modelMatrix = object.getMatrix();
                var mvpMatrix = new Matrix4(manager.canvas.vpMatrix);
                mvpMatrix.multiply(modelMatrix);
                gl.uniformMatrix4fv(canvas.program.u_MvpMatrix,false,mvpMatrix.elements);

                //write the normal matrix of the object to the shader
                var normalMatrix = new Matrix4();
                normalMatrix.setInverseOf(modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(canvas.program.u_NormalMatrix,false,normalMatrix.elements);

                gl.uniform3fv(manager.canvas.program.u_Ka,object.attr.material.m_Ka.elements);
                gl.uniform3fv(manager.canvas.program.u_Kd,object.attr.material.m_Kd.elements);
                gl.uniform3fv(manager.canvas.program.u_Ks,object.attr.material.m_Ks.elements);
                gl.uniform1f(manager.canvas.program.u_Mgls,object.attr.material.m_gls);
                gl.uniform1f(manager.canvas.program.u_d,object.attr.material.d);
                gl.uniform1i(manager.canvas.program.u_IsTexture,object.isTexture?1:0);
            }
        }

        manager.add = function (object,selectable) {
            objects.push(object);
            if(selectable){
                selects.push(object);
            }
        }
        
        manager.removeObject = function (object) {
            for(var i = 0;i<objects.length;i++){
                if(objects[i] == object){
                    objects.splice(i,1);
                    if(object.selectable){
                        for(var h = 0;h<selects.length;h++){
                            if(selects[h] == object){
                                selects.splice(h,1);
                                return true;
                            }
                        }
                    }
                    return true;
                }
            }
            return false;
        }

        return manager;
    }
}