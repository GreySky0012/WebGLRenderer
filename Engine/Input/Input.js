window.addEventListener("keydown",function () {
    Input.getInstance().keyDown[event.keyCode] = true;
    Input.getInstance().key[event.keyCode] = true;
});

window.addEventListener("keyup",function () {
    Input.getInstance().keyUp[event.keyCode] = true;
    Input.getInstance().key[event.keyCode] = false;
});

window.addEventListener("mousemove",function () {
    Input.getInstance().mousePosition[0] = event.clientX;
    Input.getInstance().mousePosition[1] = event.clientY;
})

window.addEventListener("mousedown",function () {
    Input.getInstance().mouseDown = true;
    Input.getInstance().mouse = true;
})

window.addEventListener("mouseup",function () {
    Input.getInstance().mouseUp = true;
    Input.getInstance().mouse = false;
});

var Input = (function () {
    var instance;
    
    function init() {
        //private functions and variables
        
        return{
            //public functions and variables

            mousePosition:{},

            keyBuffer:[],
            mouseBuffer:false,
            keyBuffer:[],
            mouseUp:false,
            mouseDown:false,
            mouse:false,
            key:[],
            keyDown:[],
            keyUp:[],


            Update:function () {
                if(this.mouseBuffer)
                    this.mouseDown = false;
                else
                    this.mouseUp = false;
                this.mouseBuffer = this.mouse||this.mouseDown;
                for (var i = 0;i<223;i++)
                {
                    if(this.keyBuffer[i])
                        this.keyDown[i] = false;
                    else
                        this.keyUp[i] = false;
                    this.keyBuffer[i] = this.key[i]||this.keyDown[i];
                }
            }
        }
    }

    //the outer package of the class
    return{
        getInstance:function () {
            if(!instance){
                instance = init();
                for (var i = 0;i<223;i++){
                    instance.key.push(false);
                    instance.keyUp.push(false);
                    instance.keyDown.push(false);
                    instance.keyBuffer.push(false);
                }
            }
            return instance;
        }
    }
})();

var getMousePosition = function () {
    var pos = Input.getInstance().mousePosition;
    var x = pos[0], y = pos[1];
    var size  = Window.getInstance().getMainCanvas().getSize().elements;

    // If pressed position is inside <canvas>, check if it is above object
    var x_in_canvas = x, y_in_canvas = size[1] - y;

    return new Vector2([x_in_canvas,y_in_canvas]);
}

var mouseButton = function(){
    return Input.getInstance().mouse;
};

var mouseButtonDown = function () {
    return Input.getInstance().mouseDown;
};

var mouseButtonUp = function () {
    return Input.getInstance().mouseUp;
};

var keyButtonUp = function (keyCode) {
    return Input.getInstance().keyUp[keyCode];
};

var keyButton = function (keyCode) {
    return Input.getInstance().key[keyCode];
};

var keyButtonDown = function (keyCode) {
    return Input.getInstance().keyDown[keyCode];
};

var checkPick = function () {
    return Window.getInstance().checkSelect(getMousePosition());
}

var keyCode = {};
keyCode.A = 65;
keyCode.B = 66;
keyCode.C = 67;
keyCode.D = 68;
keyCode.E = 69;
keyCode.F = 70;
keyCode.G = 71;
keyCode.H = 72;
keyCode.I = 73;
keyCode.J = 74;
keyCode.K = 75;
keyCode.L = 76;
keyCode.M = 77;
keyCode.N = 78;
keyCode.O = 79;
keyCode.P = 80;
keyCode.Q = 81;
keyCode.R = 82;
keyCode.S = 83;
keyCode.T = 84;
keyCode.U = 85;
keyCode.V = 86;
keyCode.W = 87;
keyCode.X = 88;
keyCode.Y = 89;
keyCode.Z = 90;
keyCode.Num0 = 48;
keyCode.Num1 = 49;
keyCode.Num2 = 50;
keyCode.Num3 = 51;
keyCode.Num4 = 52;
keyCode.Num5 = 53;
keyCode.Num6 = 54;
keyCode.Num7 = 55;
keyCode.Num8 = 56;
keyCode.Num9 = 57;
keyCode.Pad0 = 96;
keyCode.Pad1 = 97;
keyCode.Pad2 = 98;
keyCode.Pad3 = 99;
keyCode.Pad4 = 100;
keyCode.Pad5 = 101;
keyCode.Pad6 = 102;
keyCode.Pad7 = 103;
keyCode.Pad8 = 104;
keyCode.Pad9 = 105;
keyCode.Asterisk = 106;
keyCode.PadPlus = 107;
keyCode.PadEnter = 108;
keyCode.PadMinus = 109;
keyCode.PadPeriod = 110;
keyCode.PadSlash = 111;
keyCode.F1 = 112;
keyCode.F2 = 113;
keyCode.F3 = 114;
keyCode.F4 = 115;
keyCode.F5 = 116;
keyCode.F6 = 117;
keyCode.F7 = 118;
keyCode.F8 = 119;
keyCode.F9 = 120;
keyCode.F10 = 121;
keyCode.F11 = 122;
keyCode.F12 = 123;
keyCode.BackSpace = 8;
keyCode.Tab = 9;
keyCode.Clear = 12;
keyCode.Enter = 13;
keyCode.Shift = 16;
keyCode.Control = 17;
keyCode.Alt = 18;
keyCode.Capelock = 20;
keyCode.Esc = 27;
keyCode.Spacebar = 32;
keyCode.Pageup = 33;
keyCode.Pagedown = 34;
keyCode.End = 35;
keyCode.Home = 36;
keyCode.LeftArrow = 37;
keyCode.UpArrow = 38;
keyCode.RightArrow = 39;
keyCode.DownArrow = 40;
keyCode.Insert = 45;
keyCode.Delete = 46;
keyCode.NumLock = 144;
keyCode.Semicolon = 186;
keyCode.Equals = 187;
keyCode.Less = 188;
keyCode.Underscore = 189;
keyCode.Greater = 190;
keyCode.Question = 191;
keyCode.BackQuote = 192;
keyCode.LeftBracket = 219;
keyCode.Or = 220;
keyCode.RightBracket = 221;
keyCode.Quote = 222;

