import { extend, useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { OBJLoader } from "three-stdlib";


class GeometryOBJ extends THREE.BufferGeometry {
    constructor(filepath) {
        super();

        const loader = new OBJLoader();
        console.log(filepath);
        loader.load(filepath, (object, materials) => {
            console.log(object);
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