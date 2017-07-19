/**
 * Created by Mercer on 2016/11/24.
 */

/**
 * the main js file of the engine,create a window and create the main canvas of the window
 * Alex Mercer
 * 2016.11.24
 */

/**
 * Window class,singleton,hold some canvases,and draw the canvases
 * Alex Mercer
 * 2016.11.24
 */
var Window = (function () {
    var instance;

    function init() {
        //private functions and variables

        //the canvases of the window
        var canvases = [];
        canvases.push(Canvas.create('canvas','VShader.vert','FShader.frag'));

        /**
         * draw the window
         */
        var draw = function () {
            for(var c = 0;c<canvases.length;c++){
                if(canvases[c].enable){
                    if(canvases.mainLoop){
                        canvases[c].mainLoop();
                    }
                    canvases[c].draw();
                }
            }
        }

        //draw the selectable object with specific color
        var drawSelect = function (array) {
            var alpha = 0;
            for(var i = 0;i<canvases.length;i++){
                array.push(canvases[i].drawSelect(alpha));
                alpha+=array.top;
            }
        }

        //get the pixel's color where the user has clicked
        var getSelectColor = function (x,y) {
            var pixels = new Uint8Array(4);
            canvases[0].gl.readPixels(x, y, 1, 1, canvases[0].gl.RGBA, canvases[0].gl.UNSIGNED_BYTE, pixels);
            return pixels[0];
        }

        var frame = 60;
        var lastTime = -1000;
        var nowTime;

        return {
            //public functions and variables

            ready:0,

            hud:HUD.create(document.getElementById('hud')),

            //get the main canvas of the window
            getMainCanvas:function () {
                return canvases[0];
            },

            //create and return a new canvas
            addCanvas:function (id,width,height,VShader,FShader) {
                //add a new canvas into the window
                var body = document.body;
                var newCanvas = document.createElement("canvas");
                newCanvas.id = id;
                newCanvas.width = String(width);
                newCanvas.height = String(height);
                body.appendChild(newCanvas);

                //add the new canvas into the canvas array
                var canvas = Canvas.create(id,VShader,FShader);
                canvas.init();
                canvases.push(canvas);

                return canvas;
            },

            //find a canvas by id
            findCanvasById:function(id){
                for(var c  = 0;c<canvases.length;c++){
                    if(canvases[c].id == id)
                        return c;
                }
                return null;
            },

            //check has user clicked some objects in the window
            checkSelect:function (pos) {
                var retVal;
                var array = [];
                drawSelect(array);
                var num = getSelectColor(pos.elements[0],pos.elements[1]);
                if (num == 255){
                    retVal = null;
                }else {
                    for(var now = 0;now<array.length;now++){
                        if(num<array[now]){
                            retVal =  canvases[now].getSelect(num);
                            break;
                        }
                    }
                }
                draw();
                return retVal;
            },

            start:function () {
                MainFunction();
                update();
            },

            update:function () {
                var date = new Date();
                var thisTime = date.getTime();
                nowTime =  thisTime;
                /*while(nowTime - lastTime<1000/frame){
                    nowTime =  date.getTime();
                }*/
                frame = 1000/(nowTime-lastTime);

                var array = [];
                this.hud.frame = Math.floor(frame);
                this.hud.draw();
                draw();

                Input.getInstance().Update();
                MainUpdate();

                lastTime = thisTime;
            }
        }
    }

    //the outer package of the class
    return{
        getInstance:function () {
            if(!instance){
                instance = init();
                instance.getMainCanvas().init();
            }
            return instance;
        }
    }
})();

//the main function of the window
function main() {
    while (loadNum != 0){}
    start();
}

function start() {
    if(Window.getInstance().ready == 0)
        Window.getInstance().start();
    else
        requestAnimationFrame(start);
}

function update() {
    if(Window.getInstance().ready == 0)
        Window.getInstance().update();
    requestAnimationFrame(update);
}