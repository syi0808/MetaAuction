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
import { Entity } from './entityManager/entity';
import { MapManager } from './mapManager';
import { ShaderManager } from './shaderManager';
import 'regenerator-runtime/runtime';
import { LedModel } from './modelManager/led';

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
    clock: THREE.Clock;
    lastTime: number;

    constructor() {
        this.renderer = new THREE.WebGL1Renderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;
        this.camera.position.y = 5;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.clock = new THREE.Clock();
        this.lastTime = 0;

        this.scene = new THREE.Scene();
        this.physicsManager = new PhysicsManager();
        this.loadManager = new LoadManager();
        this.mouseManager = new MouseManager();
        this.playerManager = new PlayerManager(new Entity(new THREE.Object3D(), new CANNON.Body()));
        this.entityManager = new EntityManager(this.scene, this.physicsManager.world);
        this.cameraManager = new CameraManager(this.camera, this.playerManager);
        this.mapManager = new MapManager(this.scene, this.entityManager);
        this.shaderManager = new ShaderManager(this.renderer, this.scene, this.camera);

        this.loadManager
            .load([Paths.character])
            .then(models => {
                const character = models[Paths.character];
                character.scale.setScalar(.01);
                this.playerManager.setCharacter(this.entityManager.addCustom(character, { mass: 10, size: [.4, 1.77, .28], position: [0, 5, 0], isModel: true }));
            });
        
        this.loadManager.addEventListener("load", () => {
            console.log("Success Loaded !");
        });

        this.init();
    }

    init() {
        new Helper(this.scene);
        this.renderer.shadowMap.enabled = true;

        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;

        this.scene.add(new LedModel(1.3, 2).group);
        this.entityManager.addModel(new ChairModel(), { mass: 0, position: [0, 1, 0] });
        this.entityManager.addObject3D(new THREE.Mesh(new THREE.SphereGeometry(.2), new THREE.MeshToonMaterial()), { mass: .5, type: ShapeType.SPHERE }).cannon.position.y = 3;

        this.animate();
    }

    animate() {
        const currentTime = this.clock.getElapsedTime();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const materials: { [key: string]: THREE.Material } = {};

        // this.renderer.render(this.scene, this.camera);
        
        this.scene.traverse(obj => {
            if(this.shaderManager.layer.test(obj.layers) === false) {
                //@ts-ignore
                materials[obj.uuid] = obj.material;
                //@ts-ignore
                obj.material = new THREE.MeshBasicMaterial({ color: "black" });
            }
        });
        this.shaderManager.bloomComposer.render();
        this.scene.traverse(obj => {
            if(materials[obj.uuid]) {
                //@ts-ignore
                obj.material = materials[obj.uuid];
                delete materials[obj.uuid];
            }
        });
        this.shaderManager.finalComposer.render();

        this.entityManager.animate();
        this.physicsManager.animate(delta);
        this.playerManager.animationManager.animate(delta);

        if(this.mouseManager.isLocked) {
            this.cameraManager.animate(this.mouseManager.getAngleY());
            this.playerManager?.animate(delta, this.mouseManager.getAngleX());
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}

// For Debuging
//@ts-ignore
window.m = new Main();