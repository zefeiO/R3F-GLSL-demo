import { extend } from "@react-three/fiber";
import * as THREE from "three";

class ColorMaterial extends THREE.RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                slide: { value: 0.5 },
                tPosition: { value: new THREE.Texture("hotpink") },
                tNormal: { value: new THREE.Texture("hotpink") }
            },
            vertexShader: `
                in vec3 position;
                in vec2 uv;
                out vec2 vUv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader: `    
                precision highp float;
                precision highp int;
                layout(location = 0) out vec4 pc_FragColor;
                in vec2 vUv;
                uniform sampler2D tPosition;
                uniform sampler2D tNormal;
                uniform float slide;
                void main() {
                    vec3 position = texture( tPosition, vUv ).rgb;
                    vec3 normal = texture( tNormal, vUv ).rgb;
                    pc_FragColor.rgb = mix( position, normal, step( slide, vUv.x ) );
                    pc_FragColor.a = 1.0;
                }`,
            glslVersion: THREE.GLSL3
        })
    }
}

extend({ ColorMaterial });