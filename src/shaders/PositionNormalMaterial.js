import * as THREE from "three"
import { extend } from "@react-three/fiber"

class PositionNormalMaterial extends THREE.RawShaderMaterial {
    constructor() {
        super({
            vertexShader: `
                in vec3 position;
                in vec3 normal;
                in vec2 uv;
        
                out vec3 vPosition;
                out vec3 vNormal;
                out vec2 vUv;
        
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
        
                void main() {
        
                    vUv = uv;
                    vPosition = position;
            
                    // get smooth normals
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            
                    // used transformed normal or world normal
                    vNormal = normalize( normal );
            
                    gl_Position = projectionMatrix * mvPosition;
        
                }`,
            fragmentShader: `
                precision highp float;
                precision highp int;
    
                layout(location = 0) out vec4 gPosition;
                layout(location = 1) out vec4 gNormal;
    
                in vec3 vPosition;
                in vec3 vNormal;
                in vec2 vUv;
    
                void main() {
    
                    // write positions to G-Buffer
                    gPosition = vec4( normalize( vPosition ), 0.0 );
    
                    // write normals to G-Buffer
                    gNormal = vec4( normalize( vNormal ), 0.0 );
    
                }`,
            glslVersion: THREE.GLSL3
        })
    }
}

extend({ PositionNormalMaterial });