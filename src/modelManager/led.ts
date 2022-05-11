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
        // Grow Box
        this.group.add(this.createGrowBox());

        // Light
        const [light, lightTarget] = this.createLight();
        this.group.add(light);
        this.group.add(lightTarget);
    }

    createLight() {
        const light = new THREE.SpotLight(this.color, 2, 0, Math.PI / 6, 1);
        light.castShadow = true;
        return [light, light.target];
    }

    createGrowBox() {
        const { width, height, color } = this;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({ color })
        );
        mesh.layers.enable(Layer.BLOOM_EFFECT);
        mesh.rotateX(Math.PI / 2);
        return mesh;
    }
}