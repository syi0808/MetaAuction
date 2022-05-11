import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { Entity } from '../entityManager/entity';
import { KeyboardManager } from '../keyboardManager';
import { Paths } from '../libs/paths';
import { Loader } from '../loadManager';
import { 
    BackwardState,
    ForwardState, 
    IdleState, 
    LeftState, 
    RightState, 
    State
} from './state';

const States = {
    "idle": IdleState,
    "forward": ForwardState,
    "backward": BackwardState,
    "right": RightState,
    "left": LeftState,
} as const;

export interface Animation {
    clip: THREE.AnimationClip;
    action: THREE.AnimationAction;
}

export type SetState = (name: string) => void;

export class AnimationManager {
    loader: Loader;
    character: Entity;
    mixer: AnimationMixer;
    currentState?: State;
    animations: { [key: string]: Animation };
    keyboardManager: KeyboardManager;

    constructor(character: Entity, keyboardManager: KeyboardManager, loader: Loader) {
        this.character = character;
        this.keyboardManager = keyboardManager;
        this.mixer = new THREE.AnimationMixer(character.three);
        this.animations = {};
        this.loader = loader;
    }

    setCharacter(character: Entity) {
        this.character = character;
        this.mixer = new THREE.AnimationMixer(character.three);
        this.init();
    }

    async init() {
        const loadedAnimations = await this.loader.load([
            Paths.idle,
            Paths.jump,
            Paths.forward,
            Paths.backward,
            Paths.left,
            Paths.right,
        ]);

        this.onLoad("idle", loadedAnimations[Paths.idle]);
        this.onLoad("jump", loadedAnimations[Paths.jump]);
        this.onLoad("forward", loadedAnimations[Paths.forward]);
        this.onLoad("backward", loadedAnimations[Paths.backward]);
        this.onLoad("left", loadedAnimations[Paths.left]);
        this.onLoad("right", loadedAnimations[Paths.right]);

        this.setState("idle");
    }

    setState(name: string) {
        const prevState = this.currentState;

        if(prevState && prevState.name === name) return;

        const nextState = new States[name as keyof typeof States](this.animations, this.setState.bind(this));

        this.currentState = nextState;
        nextState.enter(prevState);
    }

    onLoad(name: string, animation: THREE.Group) {
        const clip = animation.animations[0];

        this.animations[name] = {
            clip,
            action: this.mixer.clipAction(clip),
        };
    }

    animate(delta: number) {
        this.mixer.update(delta);
        if(this.currentState) this.currentState.animate(this.keyboardManager.keys);
    }
}