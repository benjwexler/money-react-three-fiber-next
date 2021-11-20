
precision mediump float;

varying float vRandom;
varying vec2 vUv;

// uniform float u_time;
uniform vec3 uColor;
uniform sampler2D uTexture;

void main()
{
    // gl_FragColor = vec4(1.0, 0.0, 0.5, 1);
    // gl_FragColor = vec4(.3, vRandom, vRandom, 1);
    // gl_FragColor = vec4(abs(sin(u_time)),1.0,1.0,1.0);
    // gl_FragColor = vec4(abs(sin(1.0)),1.0,1.0,1.0);
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(uColor ,1.0);
    gl_FragColor = vec4(textureColor);
    // gl_FragColor = vec4(.3, vRandom, vRandom, vRandom);
    // gl_FragColor = vec4(.3, vRandom, 0, 1);
}