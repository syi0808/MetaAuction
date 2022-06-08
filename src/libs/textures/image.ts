import * as THREE from 'three';

export class ImageTextrue {
    texture: THREE.Texture;

    constructor(url: string) {
        this.texture = new THREE.TextureLoader().load(url);
    }
}