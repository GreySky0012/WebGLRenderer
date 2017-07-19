/**
 * Created by Mercer on 2016/12/3.
 */

var birds = [];
var mainCanvas;
var robot = [];
var count = 0;
var camera;
var nowCamera = 0;
var hud;
var select = null;

var instantiaBird = function (pos) {
    var x = pos.elements[0],y = pos.elements[1],z = pos.elements[2];
    var rx = y == 0?0:Math.atan(z/y),ry = Math.atan(x/z);
    if(z>0)
        ry+=180;
    var bird = OBJObject.create(mainCanvas,"bird.obj",0.003,true,true);
    bird.setPosition(pos);
    //bird.rotate(new Vector3([rx,ry,0]));
    birds.push(bird);
}

var getRand = function (min,max) {
    return Math.random()*(max-min)+min;
}

var getRandPosition = function () {
    var x = getRand(0,12);
    var y;
    var z = getRand(3,10);
    var dir = Math.floor(getRand(0,4));
    if(dir == 0){
        x-=10;z+=3;
        y = getRand(-z+1,z-1);
    }else if(dir == 1){
        var temp = x;
        x = z-10;
        z = temp-10;
        y = getRand(x+1,-x-1);
    }else if(dir == 2){
        x-=3;
        z-=10;
        y = getRand(z+1,-z-1);
    }else{
        var temp = x;
        x = z+3;
        z = temp-3;
        y = getRand(-x+1,x-1);
    }
    return new Vector3([x,y,z]);
}

var checkBirdNum = function () {
    if(birds.length<8){
        instantiaBird(getRandPosition());
    }
}

var deleteBird = function (bird) {
    for(var i = 0;i<birds.length;i++){
        if (birds[i] == bird){
            birds.splice(i,1);
        }
    }
}
/*
var MainFunction = function () {
    mainCanvas = Window.getInstance().getMainCanvas();

    var light = Light.create(mainCanvas,1,new Vector3([0.0,0.0,1.0]),new Vector3([1.0, 1.0, 1.0]));

    mainCanvas.setAmbientLight(new Vector3([0.2, 0.2, 0.2]));
    mainCanvas.setPointerHide();

    camera = mainCanvas.getCamera(0);
    camera.setModel(camera.Perspective);

    mainCanvas.setBackGround("sky.jpg");
    hud = Window.getInstance().hud;
    hud.color = new Vector3([1.0,0.0,0.0]);
    hud.point.push(new Vector2([400,400]));

    instantiaBird(new Vector3([0.0,0.0,-9.0]));
};

var MainUpdate = function () {
    count+=1;
    if (count>=40){
        count = 0;
        checkBirdNum();
    }
    if(mouseButtonDown()){
        var bird = Window.getInstance().checkSelect(mainCanvas.getSize().mult(0.5).add(new Vector2([1.0,1.0])));
        if(bird){
            deleteBird(bird);
            bird.removeFromCanvas();
        }
    }
    hud.canvas.addEventListener("mousemove", function(event) {

        var rx,ry;
        if(document.pointerLockElement) {
            rx = (-event.movementX / 200);
            ry = (-event.movementY / 200);
            camera.rotate(new Vector3([ry/3,rx/3,0]));
        }

    }, false);
}*/

var MainFunction = function () {
    mainCanvas = Window.getInstance().getMainCanvas();
    mainCanvas.setPointerHide();
    mainCanvas.addCamera();
    mainCanvas.getCamera(1).setModel(Camera.Perspective);
    mainCanvas.getCamera(1).setLookAt(0.0,5.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0);
    camera = mainCanvas.getCamera(0);
    camera.setLookAt(0.0,0.0,5.0,0.0,0.0,0.0,0.0,1.0,0.0);
    camera.setModel(Camera.Perspective);

    robot.push(Robot.create(mainCanvas,true));
    robot.push(Robot.create(mainCanvas,true));
    robot.push(Robot.create(mainCanvas,true));
    robot[1].setPosition(new Vector3([-1,0.0,0.0]));
    robot[2].setPosition(new Vector3([0.0,-1.0,0.0]));
    //add a parallel light in the canvas
    Light.create(mainCanvas,Light.parallel,new Vector3([0.0,0.0,1.0]),new Vector3([1.0, 1.0, 1.0]));
    PointLight.create(mainCanvas,new Vector3([1.0,0.0,3.0]),new Vector3([1.0, 1.0, 1.0]));
    mainCanvas.setAmbientLight(new Vector3([0.2, 0.2, 0.2]));

    hud = Window.getInstance().hud;
    hud.color = new Vector3([1.0,0.0,0.0]);
    hud.point.push(new Vector2([400,400]));

    hud.canvas.addEventListener("mousemove", function(event) {
        var rx,ry;
        if(document.pointerLockElement) {
            rx = (-event.movementX / 100);
            ry = (-event.movementY / 100);
            camera.rotate(new Vector3([ry,rx,0]));
        }
    }, false);
}

var MainUpdate = function () {
    if(mouseButtonDown()){
        var currentSelect;
        if(currentSelect = Window.getInstance().checkSelect(new Vector2([400,400]))){
            if(currentSelect == select){
                select.unSelect();
                select = null;
            }else {
                if (select){
                    select.unSelect();
                }
                select = currentSelect;
                select.select();
            }
        }else {
            if(select){
                select.unSelect();
            }
            select = null;
        }
    }
    if(keyButtonDown(keyCode.Q)){
        nowCamera = 1-nowCamera;
        mainCanvas.setNowCamera(nowCamera);
        camera = mainCanvas.getNowCamera();
    }
    if(keyButton(keyCode.A)){
        if(select){
            select.turn(true);
        }else {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position);
            dir.cross(camera.attr.up).mult(-1).normalize().mult(0.3);

            camera.move(dir);
        }
    }else if(keyButton(keyCode.D)){
        if(select) {
            select.turn(false);
        }else {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position);
            dir.cross(camera.attr.up).normalize().mult(0.3);

            camera.move(dir);
        }
    }
    if (keyButton(keyCode.W)){
        if(select){
            select.walk(true);
        }else {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position).normalize().mult(0.3);

            camera.move(dir);
        }
    }else if(keyButton(keyCode.S)){
        if(select){
            select.walk(false);
        }else {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position).mult(-1).normalize().mult(0.3);

            camera.move(dir);
        }
    }
}

var PointLight = {
    create:function (canvas,position,color) {
        var light = Light.create(canvas,Light.point,position,color);
        var point = Cube.create(canvas,true);
        point.setSize(new Vector3([0.1,0.1,0.1]));
        point.setPosition(position);
        point.setColor(new Vector3([1.0,0.0,0.0]));

        point.walk = function (forward) {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position).mult(forward?1:-1).normalize().mult(0.3);
            point.moveBy(dir);
            light.move(dir);
        }
        
        point.turn = function (isLeft) {
            var dir = new Vector3(camera.attr.lookAt.elements).subtract(camera.attr.position);
            dir.cross(camera.attr.up).mult(isLeft?-1:1).normalize().mult(0.3);

            point.moveBy(dir);
            light.move(dir);
        }

        point.select = function(){
            this.setColor(new Vector3([0.0,1.0,0.0]));
        }
        point.unSelect = function () {
            this.setColor(new Vector3([1.0,0.0,0.0]))
        }

        return point;
    }
}

var Robot = {
    create:function (canvas,select) {
        var robot = GameObject.create(canvas,select);

        var direction = new Vector3([0.0,0.0,-1.0]);
        var angle = 0;
        var maxAngle = 30;
        var add = true;

        var m = Material.create();
        m.m_Kd = new Vector3([0.8, 0.0, 1.0]);
        m.m_Ks = new Vector3([0.8, 0.0, 1.0]);
        m.m_Ka = new Vector3([0.0, 1.0, 1.0]);

        var m_n = Material.create();
        m_n.m_Kd = new Vector3([1.0, 0.8, 0.0]);
        m_n.m_Ks = new Vector3([1.0, 0.8, 0.0]);
        m_n.m_Ka = new Vector3([1.0, 0.0, 1.0]);
        m_n.m_gls = 100.0;

        var head = Cube.create(canvas,false);
        head.setSize(new Vector3([0.4,0.4,0.4]));
        head.setPosition(new Vector3([0.0,0.8,0.0]));
        robot.addChild(head);
        head.setMaterial(m);
        head.attr.texture = [
            1.0,1.0,0.0,
            1.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,0.0,
            1.0,1.0,0.0,
            1.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,0.0
        ];
        head.loadTexture('face.png');

        var body = Cube.create(canvas,false);
        body.setSize(new Vector3([0.8,1.0,0.4]));
        body.setPosition(new Vector3([0.0,0.1,0.0]));
        robot.addChild(body);
        body.setMaterial(m);

        var left_arm = GameObject.create(canvas,false);
        left_arm.setPosition(new Vector3([-0.5,0.6,0.0]));
        robot.addChild(left_arm);

        var left_arm_cube = Cube.create(canvas,false);
        left_arm_cube.setSize(new Vector3([0.2,0.8,0.4]));
        left_arm_cube.setPosition(new Vector3([-0.5,0.2,0.0]));
        left_arm.addChild(left_arm_cube);
        left_arm_cube.setMaterial(m);

        var right_arm = GameObject.create(canvas,false);
        right_arm.setPosition(new Vector3([0.5,0.6,0.0]));
        robot.addChild(right_arm);

        var right_arm_cube = Cube.create(canvas,false);
        right_arm_cube.setSize(new Vector3([0.2,0.8,0.4]));
        right_arm_cube.setPosition(new Vector3([0.5,0.2,0.0]));
        right_arm.addChild(right_arm_cube);
        right_arm_cube.setMaterial(m);

        var left_leg = GameObject.create(canvas,false);
        left_leg.setPosition(new Vector3([-0.2,-0.4,0.0]));
        robot.addChild(left_leg);

        var left_leg_cube = Cube.create(canvas,false);
        left_leg_cube.setSize(new Vector3([0.2,0.6,0.4]));
        left_leg_cube.setPosition(new Vector3([-0.2,-0.7,0.0]));
        left_leg.addChild(left_leg_cube);
        left_leg_cube.setMaterial(m);

        var right_leg = GameObject.create(canvas,false);
        right_leg.setPosition(new Vector3([0.2,-0.4,0.0]));
        robot.addChild(right_leg);

        var right_leg_cube = Cube.create(canvas,false);
        right_leg_cube.setSize(new Vector3([0.2,0.6,0.4]));
        right_leg_cube.setPosition(new Vector3([0.2,-0.7,0.0]));
        right_leg.addChild(right_leg_cube);
        right_leg_cube.setMaterial(m);

        robot.scale(new Vector3([0.5,0.5,0.5]));

        //
        // rotate the limbs of the robot
        // @param isLeft is the left arm swinging forward
        //
        var limbRotate = function (isLeft) {
            var value = isLeft?1:-1;
            left_arm.rotate(new Vector3([1.0*value,0.0,0.0]));
            right_arm.rotate(new Vector3([-1.0*value,0.0,0.0]));
            left_leg.rotate(new Vector3([-1.0*value,0.0,0.0]));
            right_leg.rotate(new Vector3([1.0*value,0.0,0.0]));
        }
        
        robot.setMaterial = function(material){
            head.setMaterial(material);
            body.setMaterial(material);
            left_arm_cube.setMaterial(material);
            right_arm_cube.setMaterial(material);
            left_leg_cube.setMaterial(material);
            right_leg_cube.setMaterial(material);
        }

        robot.turn = function(isLeft){
            var m = new Matrix4().setRotateXYZ(new Vector3([0.0,isLeft?1.0:-1.0,0.0]));
            direction = m.multiplyVector3(direction);
            this.rotate(new Vector3([0.0,isLeft?1.0:-1.0,0.0]));
        }
        
        robot.walk = function (forward) {
            this.moveBy(new Vector3(direction.elements).normalize().mult((forward?1:-1)*0.03));
            var realAdd = !(add^forward);
            if(angle == maxAngle){
                realAdd = false;
            }else if(angle == -maxAngle){
                realAdd = true;
            }
            limbRotate(realAdd);
            if(angle == maxAngle){
                add = !add;
            }else if(angle == -maxAngle){
                add = !add;
            }
            angle+=realAdd?1:-1;
        }
        
        robot.select = function () {
            robot.setMaterial(m_n);
        }
        
        robot.unSelect = function () {
            robot.setMaterial(m);
        }

        return robot;
    }
}