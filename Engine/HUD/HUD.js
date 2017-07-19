/**
 * Created by 53017_000 on 2016/12/28.
 */

var HUD = {
    create:function (canvas) {
        var hud = {}

        hud.context = canvas.getContext('2d');
        hud.canvas = canvas;

        hud.line = [];
        hud.color = new Vector3([1.0,1.0,1.0]);
        hud.text = [];
        hud.point = [];
        hud.frame = 0;

        hud.draw = function () {
            var ctx = this.context;
            ctx.clearRect(0,0,800,800);

            ctx.beginPath();
            for(var i = 0;i<this.line.length;i+=2){
                ctx.moveTo(this.line[i].elements[0],this.line[i].elements[1]);
                ctx.lineTo(this.line[i+1].elements[0],this.line[i+1].elements[1]);
            }
            for(var t = 0;t<this.point.length;t++){
                ctx.moveTo(this.point[t].elements[0],this.point[t].elements[1]);
                ctx.lineTo(this.point[t].elements[0]+1,this.point[t].elements[1]+1);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba('+this.color.elements[0]*255+','+this.color.elements[1]*255+','+this.color.elements[2]*255+',1)';
            ctx.stroke();

            ctx.font = '18px "Times New Roman"';
            ctx.fillStyle = 'rgba('+this.color.elements[0]*255+','+this.color.elements[1]*255+','+this.color.elements[2]*255+',1)';
            ctx.fillText('frame:'+this.frame,10,50);
            for(var h = 0;h<this.text.length;h+=2){
                ctx.fillText(this.text[h],this.text[h+1].elements[0],this.text[h+1].elements[1]);
            }
        }
        return hud;
    }
}