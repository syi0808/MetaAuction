import * as THREE from 'three';
import { PlayerManager } from "./playerManager";

export type PortalEventListener = (time: number) => void;

export class PortalManager {
    portals: [[number, number, number], [number, number, number], PortalEventListener][];
    timer: { [key: number]: ReturnType<typeof setTimeout> | null };
    playerManager: PlayerManager;

    constructor(playerManager: PlayerManager) {
        this.portals = [];
        this.timer = {};
        this.playerManager = playerManager;
    }

    addPortal(position: [number, number, number], destination: [number, number, number], callback?: PortalEventListener) {
        this.portals.push([position, destination, callback ?? ((() => {})  as PortalEventListener)]);
    }

    getIsCollision(position: [number, number, number]) {
        const vector3 = new THREE.Vector3(...position);
        return new THREE.Box3().setFromObject(this.playerManager.character.three).intersectsBox(new THREE.Box3(vector3.clone().addScalar(-.5), vector3.clone().addScalar(.5)));
    }

    update() {
        this.portals.forEach(([position, destination, callback], i) => {
            if(this.getIsCollision(position)) {
                if(this.timer[i]) return;
                let count = 0;
                this.timer[i] = setInterval(() => {
                    callback(++count);
                    if(count >= 3) {
                        this.playerManager.setPlayerVector(destination);
                        clearInterval(this.timer[i]!);
                    }
                }, 1000);
            } else {
                clearInterval(this.timer[i]!);
                this.timer[i] = null;
            }
        });
    }
}