import { createPortal, useFrame } from "@react-three/fiber";
import { useMemo, useState, useRef } from "react";
import * as THREE from "three"
import "./shaders/PositionNormalMaterial";
import "./shaders/ColorMaterial";
import { OrbitControls } from "@react-three/drei";

export function NeuralTextureQuad() {
    const shaderRef = useRef();

    // create scenes
    const [scene] = useState(() => new THREE.Scene());
    const [perspectiveCamera] = useState(() => {
        const fieldOfView = 45;
        const screenAspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 10;
        
        const camera = new THREE.PerspectiveCamera(fieldOfView, screenAspect, near, far);
        camera.position.z = 8;
        return camera;
    });

    const framebuffer_position_normal = useMemo(() => {
        let framebuffer_position_normal = new THREE.WebGLMultipleRenderTargets(window.innerWidth, window.innerHeight, 2);
        for ( let i = 0; i < 2; i ++ ) {
          framebuffer_position_normal.texture[i].minFilter = THREE.NearestFilter;
          framebuffer_position_normal.texture[i].magFilter = THREE.NearestFilter;
        }
        framebuffer_position_normal.texture[0].name = 'position';
        framebuffer_position_normal.texture[1].name = 'normal';
        framebuffer_position_normal.samples = 4;
        return framebuffer_position_normal;
    }, [window.innerWidth, window.innerHeight])


    useFrame((state) => {
        let { gl, camera } = state;

        gl.setRenderTarget(framebuffer_position_normal);
        gl.clear();
        gl.render(scene, perspectiveCamera);

        // reset render target
        gl.setRenderTarget(null);
        shaderRef.current.uniforms.tPosition.value = framebuffer_position_normal.texture[0];
        shaderRef.current.uniforms.tNormal.value = framebuffer_position_normal.texture[1];
        shaderRef.current.uniforms.tPosition.value.needsUpdate = true;
        shaderRef.current.uniforms.tNormal.value.needsUpdate = true;

        // configure orthographic camera
        camera.position.z = 10;
        camera.lookAt(0, 0, 0);
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();


    })

    return (
        <>
            {/* render scene into framebuffer_position_normal */}
            {createPortal(
                <>
                    <OrbitControls camera={perspectiveCamera} makeDefault />
                    <mesh>
                        <positionNormalMaterial />
                        <geometryOBJ attach={"geometry"} args={ ["output.obj"] } />
                    </mesh>
                </>,
                scene
            )}

            {/* post FX to be rendered in index.js */}
            <mesh>
                <colorMaterial ref={shaderRef} />
                <planeGeometry args={ [window.innerWidth, window.innerHeight] } />
            </mesh>
        </>
    )
}