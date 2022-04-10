import * as THREE from 'three';
import { Scene } from "three";
import { EntityManager } from "./entityManager";
import { MapModel } from "./modelManager/map";

export class MapManager {
    entityManager: EntityManager;
    scene: Scene;

    constructor(scene: Scene, entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.scene = scene;

        this.init();
    }

    init() {
        this.entityManager.addModel(new MapModel(), { mass: 0 });

        this.settingLight();
    }

    settingLight() {
        const light = new THREE.DirectionalLight(0x444444);
        light.position.set(0, 20, 10);
        light.castShadow = true;
        
        const ambient = new THREE.AmbientLight(0xbbbbbb);
        this.scene.add(ambient);
        this.scene.add(light); 
    }
}