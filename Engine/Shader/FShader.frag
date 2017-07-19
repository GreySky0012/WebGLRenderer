#ifdef GL_ES
precision mediump float;
#endif

varying vec3 v_Normal;
varying vec3 v_Position;
varying float v_Mgls;
varying vec3 v_Ka;
varying vec3 v_Kd;
varying vec3 v_Ks;
varying float v_d;

uniform mediump int u_IsTexture;//has the model used texture
uniform vec3 u_Eye;
uniform int u_LightNum;//maximum
uniform mat3 u_LightPosition;
uniform vec3 u_LightType;//0:no light,1:parallel light,2:point light
uniform mat3 u_LightColor;
uniform vec3 u_Gamb;

uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

vec3 i(int num,vec3 color){
    return color;
}

vec3 getColor(){
    vec3 vSpec = vec3(0.0,0.0,0.0),vDiff = vec3(0.0,0.0,0.0);
    for(int j = 0;j<3;j++){
        if(j >= u_LightNum){
            break;
        }
        vec3 lightDirection;
        if(u_LightType[j] == 1.0){
            lightDirection = -vec3(u_LightPosition[j]);
        }else if(u_LightType[j] == 2.0){
            lightDirection = vec3(u_LightPosition[j])-v_Position;
        }else{
            continue;
        }
        float f = dot(v_Normal,normalize(u_Eye-v_Position + lightDirection));
        if(f > 0.0){
            f = pow(f,v_Mgls);
            vSpec += i(j,f*vec3(u_LightColor[j]));
        }

        f = dot(v_Normal,lightDirection);
        if(f > 0.0){
            vDiff += i(j,f*vec3(u_LightColor[j]));
        }
    }
    return vDiff*v_Kd+vSpec*v_Ks+u_Gamb*v_Ka;
}

void main() {
    if(u_IsTexture == 1){
        gl_FragColor = vec4(getColor(),v_d)*texture2D(u_Sampler,v_TexCoord);
    }else{
        gl_FragColor = vec4(getColor(),v_d);
    }
}