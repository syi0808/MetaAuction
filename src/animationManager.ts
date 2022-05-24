import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { Entity } from './entityManager/entity';
import { KeyboardManager } from './keyboardManager';
import { Paths } from './libs/paths';
import { Loader } from './loadManager';

const animationTypes = ["idle", "jump", "forward", "backward", "left", "right", "forwardleft", "forwardright", "backwardleft", "backwardright"] as const;
type AnimationTypes = typeof animationTypes[number];

export interface Animation {
    clip: THREE.AnimationClip;
    action: THREE.AnimationAction;
}

export class AnimationManager {
    loader: Loader;
    character: Entity;
    mixer: AnimationMixer;
    animations: { [key in AnimationTypes]?: Animation };
    keyboardManager: KeyboardManager;
    currentState: AnimationTypes;

    constructor(character: Entity, keyboardManager: KeyboardManager, loader: Loader) {
        this.keyboardManager = new KeyboardManager();
        this.loader = loader;
        this.character = character;
        this.keyboardManager = keyboardManager;
        this.mixer = new THREE.AnimationMixer(character.three);
        this.animations = {};
        this.currentState = "jump";
    }

    setCharacter(character: Entity) {
        this.character = character;
        this.mixer = new THREE.AnimationMixer(character.three);
        this.init();
    }

    private async init() {
        const loadedAnimations = await this.loader.load([
            Paths.idle,
            Paths.jump,
            Paths.forward,
            Paths.forwardleft,
            Paths.forwardright,
            Paths.backward,
            Paths.backwardleft,
            Paths.backwardright,
            Paths.left,
            Paths.right,
        ]);

        animationTypes.forEach(key => this.onLoad(key, loadedAnimations[Paths[key]]));

        this.setState("idle");
    }

    private setState(name: AnimationTypes) {
        if(!this.animations[this.currentState] || !this.animations[name]) return;
        const prevState = this.currentState;

        if(prevState === name) return;

        this.currentState = name;
        this.enter(prevState);
    }

    private onLoad(name: AnimationTypes, animation: THREE.Group) {
        const clip = animation.animations[0];
        const action = this.mixer.clipAction(clip);
        
        action.clampWhenFinished = true;

        this.animations[name] = {
            clip,
            action: name === "jump" ? action.setLoop(THREE.LoopOnce, Infinity) : action,
        };
    }

    private enter(prevName?: AnimationTypes) {
        const nextAction = (this.animations[this.currentState] as Animation).action;
        
        if(prevName) {
            const prevAction = (this.animations[prevName] as Animation).action;
            prevAction.reset();
            nextAction.enabled = true;
            nextAction.time = 0;
            nextAction.setEffectiveTimeScale(1);
            nextAction.setEffectiveWeight(1);
            nextAction.crossFadeFrom(prevAction, .2, true);
        }

        nextAction.play();
    }

    private updateDirection(isCanJump: boolean) {
        const keys = { ...this.keyboardManager.keys };
        if(keys.forward && keys.backward) keys.forward = keys.backward = false;
        if(keys.left && keys.right) keys.left = keys.right = false;

        const { forward, backward, left, right, space } = keys;

        if(space && isCanJump) this.setState("jump");
        else if(forward && left) this.setState("forwardleft");
        else if(forward && right) this.setState("forwardright");
        else if(backward && left) this.setState("backwardleft");
        else if(backward && right) this.setState("backwardright");
        else if(forward) this.setState("forward");
        else if(backward) this.setState("backward");
        else if(left) this.setState("left");
        else if(right) this.setState("right");
        else this.setState("idle");
    }

    animate(delta: number, isCanJump: boolean) {
        if(isCanJump) this.updateDirection(isCanJump);
        this.mixer.update(delta);
    }
}