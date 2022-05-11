import * as THREE from 'three';
import { PlayerManager } from './playerManager';
import { Utils } from './utils';

export class CameraManager {
    camera: THREE.Camera;
    target: PlayerManager;
    far: number;
    angle: number;

    constructor(camera: THREE.Camera, target: PlayerManager) {
        this.camera = camera;
        this.target = target;
        this.angle = 0;
        this.far = 1;
    }

    getOffset(angle: number) {
        const offset = new THREE.Vector3(0, this.far * 0.75 + (angle / 100), -this.far - (angle / 100));

        offset.applyQuaternion(Utils.cToT().quaternion(this.target.character.cannon.quaternion));
        offset.add(Utils.cToT().vector3(this.target.character.cannon.position));

        return offset;
    }

    getLookAt() {
        const lookAt = new THREE.Vector3(0, 1, 0);

        lookAt.applyQuaternion(Utils.cToT().quaternion(this.target.character.cannon.quaternion));
        lookAt.add(Utils.cToT().vector3(this.target.character.cannon.position));

        return lookAt;
    }

    animate() {
        this.camera.position.copy(this.getOffset(this.angle));
        this.camera.lookAt(this.getLookAt());
    }
}