import { EntityManager } from "../entityManager";
import * as THREE from 'three';
import { Vector3 } from "three";
import { ShapeType } from "../physcisManager";

interface BoxOptions {
    position?: number[];
    size?: number[];
    degree?: number[];
    color?: number;
}

export class ModelManager {
    entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    createChair() {

    }
}

export class Model {
    group: THREE.Group;

    constructor() {
        this.group = new THREE.Group();
    }

    createBox({
        position = [0, 0, 0],
        size = [1, 1, 1],
        degree = [0, 0, 0],
        color = 0xffffff,
    }: BoxOptions) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(...size),
            new THREE.MeshToonMaterial({ color })
        );

        mesh.position.copy(new Vector3(...position));
        mesh.rotation.x = Math.PI / 180 * degree[0];
        mesh.rotation.y = Math.PI / 180 * degree[1];
        mesh.rotation.z = Math.PI / 180 * degree[2];
        mesh.userData.type = ShapeType.Box;

        return mesh;
    }
}