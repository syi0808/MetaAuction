import { Animation, SetState } from '.';
import { Keys } from '../keyboardManager';

type AnimationsType = { [key: string]: Animation };

export class State {
    animations: AnimationsType;
    name: string;
    setState: SetState;

    constructor(animations: AnimationsType, name: string, setState: SetState) {
        this.animations = animations;
        this.name = name;
        this.setState = setState;
    }

    enter(prevState?: State) {
        const nextAction = this.animations[this.name].action;

        if(prevState) {
            const prevAction = this.animations[prevState.name].action;

            nextAction.enabled = true;
            nextAction.time = 0;
            nextAction.setEffectiveTimeScale(1);
            nextAction.setEffectiveWeight(1);
            nextAction.crossFadeFrom(prevAction, .5, true);

            nextAction.play();
        } else nextAction.play();
    }

    animate(keys: Keys) {

    }
}

export class IdleState extends State {
    constructor(animations: AnimationsType, setState: SetState) {
        super(animations, "idle", setState);
    }

    animate(keys: Keys) {
        if(keys.forward) this.setState("forward");
        else if(keys.backward) this.setState("backward");
        else if(keys.left) this.setState("left");
        else if(keys.right) this.setState("right");
    }
}

export class ForwardState extends State {
    constructor(animations: AnimationsType, setState: SetState) {
        super(animations, "forward", setState);
    }

    animate(keys: Keys) {
        if(!keys.forward) this.setState("idle");
        else if(keys.backward) this.setState("backward");
        else if(keys.left) this.setState("left");
        else if(keys.right) this.setState("right");
    }
}

export class BackwardState extends State {
    constructor(animations: AnimationsType, setState: SetState) {
        super(animations, "backward", setState);
    }

    animate(keys: Keys) {
        if(!keys.backward) this.setState("idle");
        else if(keys.forward) this.setState("forward");
        else if(keys.left) this.setState("left");
        else if(keys.right) this.setState("right");
    }
}

export class LeftState extends State {
    constructor(animations: AnimationsType, setState: SetState) {
        super(animations, "left", setState);
    }

    animate(keys: Keys) {
        if(!keys.left) this.setState("idle");
        else if(keys.forward) this.setState("forward");
        else if(keys.backward) this.setState("backward");
        else if(keys.right) this.setState("right");
    }
}

export class RightState extends State {
    constructor(animations: AnimationsType, setState: SetState) {
        super(animations, "right", setState);
    }

    animate(keys: Keys) {
        if(!keys.right) this.setState("idle");
        else if(keys.forward) this.setState("forward");
        else if(keys.backward) this.setState("backward");
        else if(keys.left) this.setState("left");
    }
}