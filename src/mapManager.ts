import * as THREE from 'three';
import { Scene } from "three";
import { EntityManager } from "./entityManager";
import { MapModel } from "./modelManager/map";
import vertex from './libs/shaders/sky/vertex.glsl'
import fragment from './libs/shaders/sky/fragment.glsl'

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
        this.settingSky();
    }

    settingLight() {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 60, 30);
        light.castShadow = true;

        light.shadow.camera = new THREE.OrthographicCamera(-30, 30, 30, -30, 0.5, 1000);
        light.shadow.bias = .0001;

        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;

        const ambient = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambient); 
        this.scene.add(light);
    }

    settingSky() {
        const light = new THREE.HemisphereLight(0xffffff, 0xffffff, .8);
        light.color.setHSL(.6, 1, .6);
        light.groundColor.setHSL(.095, 1, .75);
        light.position.set(0, 50, 0);
        light.visible = true;

        const uniforms = {
            topColor: { value: new THREE.Color( 0x0077ff ) },
            bottomColor: { value: new THREE.Color( 0xffffff ) },
            offset: { value: 33 },
            exponent: { value: 0.6 },
        };

        uniforms.topColor.value.copy(light.color);
        this.scene.background = new THREE.Color(0, 0, 0);
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 800);
        this.scene.fog.color.copy(uniforms.bottomColor.value);

        const skyMesh = new THREE.Mesh(
            new THREE.SphereGeometry(800, 32, 15),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.BackSide,
                uniforms,
            }),
        );

        this.scene.add(skyMesh);
    }
}