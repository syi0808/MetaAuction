import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import vertex from '../libs/shaders/bloom/vertex.glsl';
import fragment from '../libs/shaders/bloom/fragment.glsl';

export enum Layer {
    "NO_EFFECT" = 0,
    "BLOOM_EFFECT" = 1,
}

export class ShaderManager {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    layer: THREE.Layers;
    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;

    constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.layer = new THREE.Layers();
        this.layer.set(Layer.BLOOM_EFFECT);
        
        const renderScene = new RenderPass(this.scene, this.camera);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 5, 0, 0);

        const bloomComposer = new EffectComposer(this.renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: vertex,
                fragmentShader: fragment
            }), "baseTexture"
        );
        finalPass.needsSwap = true;

        const finalComposer = new EffectComposer(this.renderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);

        this.bloomComposer = bloomComposer;
        this.finalComposer = finalComposer;
    }
}