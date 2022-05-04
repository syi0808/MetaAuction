import { Model } from '.';
import { Layer } from '../shaderManager';
import * as THREE from 'three';

export class LedModel extends Model {
    color: number;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        super();

        this.color = 0xffffff;
        this.width = width;
        this.height = height;

        this.init();
    }

    init() {
        // Light
        this.group.add(this.createLight());

        // Grow Box
        this.group.add(this.createGrowBox());
    }

    createLight() {
        const { width, height } = this;
        return new THREE.RectAreaLight(this.color, 1, width, height);
    }

    createGrowBox() {
        const { width, height, color } = this;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({ color })
        );
        mesh.layers.enable(Layer.BLOOM_EFFECT);
        return mesh;
    }
}