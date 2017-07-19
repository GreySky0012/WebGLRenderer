/**
 * Created by 53017_000 on 2016/12/9.
 */

var Light = {
    parallel:1,
    point:2,
    create:function (canvas,type,position,color) {
        var light = {};

        light.type = type;

        if(position)
            light.position = position;
        else
            light.position = new Vector3([0.0,0.0,0.0]);

        if(color)
            light.color = color;
        else
            light.color = new Vector4([1.0,1.0,1.0]);

        canvas.addLight(light);

        light.move = function (vec) {
            light.position.add(vec);
            canvas.dataLight();
        }

        return light;
    }
}