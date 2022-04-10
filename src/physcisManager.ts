import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export enum ShapeType {
    "Box" = 1,
}

export class PhysicsManager {
    world: CANNON.World;

    constructor() {
        this.world = new CANNON.World();

        this.init();
    }

    init() {
        this.world.gravity.set(0, -9, 0);
    }

    animate(delta: number) {
        this.world.step(1 / 60, delta, 5);
    }
}