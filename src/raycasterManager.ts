import * as THREE from 'three';
import { PageEnum } from './uiManager';

export class RaycasterManager {
    raycaster: THREE.Raycaster;
    camera: THREE.Camera;
    scene: THREE.Scene;
    models: { [key: string]: () => void; };
    events: string[];

    constructor(camera: THREE.Camera, scene: THREE.Scene) {
        this.raycaster = new THREE.Raycaster();
        this.camera = camera;
        this.scene = scene;
        this.models = {};
        this.events = [];
    }

    addModel(object: THREE.Object3D, callback: () => void) {
        this.models[object.uuid] = callback;
    }

    animate(page: PageEnum) {
        const { innerWidth, innerHeight } = window;
        const centerX = innerWidth / 2;
        const centerY = innerHeight / 2;

        this.raycaster.setFromCamera({
            x: centerX / innerWidth * 2 - 1,
            y: -(centerY / innerHeight) * 2 + 1,
        }, this.camera);

        try {
            const [intersect] = this.raycaster.intersectObjects(this.scene.children);
            const { uuid } = intersect.object;
    
            if(intersect && intersect.distance < 2.5 && this.models[uuid] && page === PageEnum.None) {
                this.events.push(uuid);
                window.addEventListener("click", this.models[uuid]);
                document.body.style.cursor = "pointer";
                if(document.getElementById("point")) document.getElementById("point")!.style.border = "3px solid green";
            } else {
                this.events.forEach(uuid => window.removeEventListener("click", this.models[uuid]));
                document.body.style.cursor = "normal";
                if(document.getElementById("point")) document.getElementById("point")!.style.border = "3px solid tomato";
            }
        } catch (e) {
            console.log(e);
        }
    }
}