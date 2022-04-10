import * as THREE from 'three';

export interface Keys {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
}

export class KeyboardManager {
    keys: Keys;

    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
        }

        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onkeyUp.bind(this));
    }

    onKeyDown(e: KeyboardEvent) {
        switch(e.keyCode) {
            // Forward
            case 87: 
                this.keys.forward = true;
                break;
            // Backward
            case 83:
                this.keys.backward = true;
                break;
            // Left
            case 65: 
                this.keys.left = true;
                break;
            // Right
            case 68:
                this.keys.right = true;
                break;
            // Space
            case 32:
                this.keys.space = true;
                break;
        }
    }

    onkeyUp(e: KeyboardEvent) {
        switch(e.keyCode) {
            // Forward
            case 87: 
                this.keys.forward = false;
                break;
            // Backward
            case 83:
                this.keys.backward = false;
                break;
            // Left
            case 65: 
                this.keys.left = false;
                break;
            // Right
            case 68:
                this.keys.right = false;
                break;
            // Space
            case 32:
                this.keys.space = false;
                break;
        }
    }
}