import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Helper } from './helper';
import { Paths } from './libs/paths';
import { LoadManager } from './loadManager';
import { PhysicsManager } from './physcisManager';
import { EntityManager } from './entityManager';
import { ShapeType } from 'three-to-cannon';
import { PlayerManager } from './playerManager';
import { ChairModel } from './modelManager/chair';
import { MouseManager } from './mouseManager';
import { CameraManager } from './cameraManager';
import { MapManager } from './mapManager';
import { ShaderManager } from './shaderManager';
import { PageEnum, UIManager } from './uiManager';
import { Entity } from './entityManager/entity';
import { ExhibitModel } from './modelManager/exhibit';
import { TextTexture } from './libs/textures/text';
import { LedModel } from './modelManager/led';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import 'regenerator-runtime/runtime';

class Main {
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    scene: Scene;
    loadManager: LoadManager;
    physicsManager: PhysicsManager;
    entityManager: EntityManager;
    mouseManager: MouseManager;
    cameraManager: CameraManager;
    playerManager: PlayerManager;
    mapManager: MapManager;
    shaderManager: ShaderManager;
    uiManager: UIManager;
    clock: THREE.Clock;
    lastTime: number;

    constructor() {
        RectAreaLightUniformsLib.init();

        this.renderer = new THREE.WebGL1Renderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        this.camera.position.y = 5;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.clock = new THREE.Clock();
        this.lastTime = 0;

        this.scene = new THREE.Scene();
        this.physicsManager = new PhysicsManager();
        this.mouseManager = new MouseManager();
        this.loadManager = new LoadManager(2);
        this.uiManager = new UIManager(this.renderer.domElement);
        this.playerManager = new PlayerManager(new Entity(new THREE.Object3D(), new CANNON.Body()), this.loadManager);
        this.entityManager = new EntityManager(this.scene, this.physicsManager.world);
        this.cameraManager = new CameraManager(this.camera, this.playerManager);
        this.mapManager = new MapManager(this.scene, this.entityManager);
        this.shaderManager = new ShaderManager(this.renderer, this.scene, this.camera);

        this.init();
    }

    init() {
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.scene.add(
            new ExhibitModel({
                title: "가지",
                url: "https://www.ui4u.go.kr/depart/img/content/sub03/img_con03030100_01.jpg",
                price: 10000,
            }).group
        );

        this.entityManager.addModel(new ChairModel(), { mass: 0, position: [0, 1, 0] });
        this.entityManager.addObject3D(new THREE.Mesh(new THREE.SphereGeometry(.2), new THREE.MeshToonMaterial()), { mass: .5, type: ShapeType.SPHERE }).cannon.position.y = 3;

        this.loadManager
            .createFBXLoader()
            .load([Paths.character])
            .then(models => {
                const character = models[Paths.character];
                character.scale.setScalar(.01);
                this.playerManager.setCharacter(this.entityManager.addCustom(character, { mass: 10, size: [.5, 1.77, .38], position: [0, 5, 0], isModel: true }));
            });

        this.loadManager.addEventListener("load", () => {
            console.log("Success Loaded !");
            setTimeout(() => this.uiManager.initPage(PageEnum.None), 300);
        });

        this.loadManager.addEventListener("progress", e => {
            console.log(e.loadedPercent);
            this.uiManager.updateProgress(e.loadedPercent);
        });

        this.animate();
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    animate() {
        const currentTime = this.clock.getElapsedTime();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.shaderManager.animate();
        this.playerManager.animationManager.animate(delta, this.playerManager.isCanJump);

        if(this.mouseManager.isLocked) {
            this.cameraManager.angle = this.mouseManager.getAngleY();
            this.playerManager?.animate(delta, this.mouseManager.getAngleX());
        }

        this.cameraManager.animate();
        this.entityManager.animate();
        this.physicsManager.animate(delta);

        requestAnimationFrame(this.animate.bind(this));
    }
}

//@ts-ignore For Debuging
window.m = new Main();