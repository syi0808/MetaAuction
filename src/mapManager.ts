import * as THREE from 'three';
import { Scene } from 'three';
import { EntityManager } from './entityManager';
import { MapModel } from './modelManager/map';
import { ShowroomModel } from './modelManager/showroom';
import { PortalManager } from './portalManager';
import { TextTexture } from './libs/textures/text';
import vertex from './libs/shaders/sky/vertex.glsl';
import fragment from './libs/shaders/sky/fragment.glsl';
import { ExhibitModel } from './modelManager/exhibit';

export class MapManager {
    entityManager: EntityManager;
    portalManager: PortalManager;
    scene: Scene;

    constructor(scene: Scene, entityManager: EntityManager, portalManager: PortalManager) {
        this.entityManager = entityManager;
        this.portalManager = portalManager;
        this.scene = scene;

        this.init();
    }

    init() {
        this.settingLight();
        this.settingSky();

        this.entityManager.addModel(new MapModel(), { mass: 0 });
        this.addDirectionalLight([0, 50, -30]);
        this.addPortal(["중고물품 보러가기", "3초간 서있으세요"], [-3, 2, 9], [21, 1, 0]);

        this.entityManager.addModel(new ShowroomModel(), { mass: 0, position: [21, 0, 0] });

        this.entityManager.addModel(new ExhibitModel({ price: 10000, title: "안경", type: "image", url: "images/glasses.jpg" }), { mass: 0, position: [25, 1, 5], degree: [0, 90, 0] });
    }

    addPortal(text: string | string[], position: [number, number, number], destination: [number, number, number]) {
        const showroomPortalText = new THREE.Mesh(
            new THREE.PlaneGeometry(2 ,1),
            new THREE.MeshBasicMaterial({
                map: new TextTexture({
                    text,
                    fontSize: 200,
                    width: 2000,
                }).textrue,
                transparent: true,
            })
        );
        showroomPortalText.position.set(...position);
        showroomPortalText.rotateY(Math.PI);
        this.scene.add(showroomPortalText);
        this.portalManager.addPortal(position, destination);
    }

    settingLight() {
        const ambient = new THREE.AmbientLight(0xbbbbbb);
        this.scene.add(ambient);
    }

    addDirectionalLight(position: [number, number, number]) {
        const light = new THREE.DirectionalLight(0x444444);
        light.position.set(...position);
        light.castShadow = true;

        light.shadow.camera = new THREE.OrthographicCamera(-30, 30, 30, -30, 0.5, 1000);
        light.shadow.bias = .0001;

        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;

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