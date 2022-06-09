import * as THREE from 'three';

export class ImageTextrue {
    texture: THREE.Texture;

    constructor(url: string) {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");
        this.texture = loader.load(url);
    }
}