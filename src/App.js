import * as THREE from "three";
import React, { useState, useMemo} from "react";
import { Canvas, extend} from "@react-three/fiber";
import { shaderMaterial} from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./styles.scss";

const DemoShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTexture: new THREE.Texture()
  },
  // Vertex Shader
  glsl`
    precision mediump float;
 
    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor.rgba = vec4(texture, 1.0); 
    }
  `
);

extend({ DemoShaderMaterial });


const Rectangle = () => {
  const [textureData, setTextureData] = useState(() => {
    const data = new Uint8Array(4 * 32 * 32);
    for (let i = 0; i < 32 * 32; ++i) {
      data[4 * i] = data[4 * i + 1] = data[4 * i + 2] = 255;
      data[4 * i + 3] = 1;
    }
    return data;
  });

  const tex = useMemo(() => {
    const tex = new THREE.DataTexture(textureData, 32, 32, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    return tex;
  }, [textureData])


  return (
    <mesh>
      <planeGeometry args={[0.4, 0.6, 16, 16]} />
      <demoShaderMaterial uTexture={tex} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ fov: 12, position: [0, 0, 5] }}>
      <Rectangle />
    </Canvas>
  );
};

const App = () => {
  return (
    <>
      <Scene />
    </>
  );
};

export default App;
