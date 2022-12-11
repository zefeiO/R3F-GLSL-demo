import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";


class GeometryOBJ extends THREE.BufferGeometry {
    constructor(filepath) {
        super();
        const loader = new OBJLoader();
        loader.load(filepath, (object, materials) => {
            object.traverse((child) => {
                if (child.geometry !== undefined) {
                    this.copy(child.geometry);
                    return;
                }
            })
        })
    }
}

extend({ GeometryOBJ });