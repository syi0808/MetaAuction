import { Scene } from "three";
import * as THREE from 'three';

export class Helper {
    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;

        const gridHelper = new THREE.GridHelper(20, 20);
        gridHelper.position.set(0, 0, 0);

        this.scene.add(gridHelper);
    }
}