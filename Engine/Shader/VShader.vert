attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec2 a_TexCoord;

uniform mediump int u_IsTexture;//has the model used texture
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform float u_Mgls;
uniform vec3 u_Ka;//Ambient color
uniform vec3 u_Kd;//diffuse color
uniform vec3 u_Ks;//specular color
uniform float u_d;

varying vec3 v_Normal;
varying vec3 v_Position;
varying float v_Mgls;
varying vec3 v_Ka;
varying vec3 v_Kd;
varying vec3 v_Ks;
varying float v_d;
varying vec4 v_Color;
varying vec2 v_TexCoord;

void main() {
    gl_Position = u_MvpMatrix*a_Position;
    v_Position = vec3(gl_Position);

    if(u_IsTexture == 1){
        v_TexCoord = a_TexCoord;
    }

    v_Normal = normalize(vec3(u_NormalMatrix*a_Normal));

    v_Mgls = u_Mgls;
    v_Ka = u_Ka;
    v_Kd = u_Kd;
    v_Ks = u_Ks;
    v_d = u_d;
}
