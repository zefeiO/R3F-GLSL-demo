import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import { NeuralTextureQuad } from "./NeuralTextureQuad";
import { OrthographicCamera } from "@react-three/drei";


const left = -window.innerWidth / 2;
const right = window.innerWidth / 2;
const top = -window.innerHeight / 2;
const bottom = window.innerHeight / 2;
const near = -100;
const far = 100;


const App = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;

    // Set the canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  return (
    <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
      <OrthographicCamera args={[left, right, top, bottom, near, far]} makeDefault={true} />
      <NeuralTextureQuad />
    </Canvas>
  );
};

export default App;
