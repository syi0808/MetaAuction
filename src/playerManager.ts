import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Vector3 } from 'three';
import { Entity } from './entityManager/entity';
import { KeyboardManager } from './keyboardManager';
import { Utils } from './utils';
import { AnimationManager } from './animationManager';
import { LoadManager } from './loadManager';

export class PlayerManager {
    keyboardManager: KeyboardManager;
    velocity: CANNON.Vec3;
    decceleration: THREE.Vector3;
    acceleration: THREE.Vector3;
    speed: number;
    character: Entity;
    direction: THREE.Vector3;
    isCanJump: boolean;
    animationManager: AnimationManager;

    constructor(character: Entity, loaderManager: LoadManager) {
        this.keyboardManager = new KeyboardManager();
        this.animationManager = new AnimationManager(character, this.keyboardManager, loaderManager.createFBXLoader());
        this.velocity = new CANNON.Vec3();

        this.decceleration = new THREE.Vector3(-10, 0, -10);
        this.acceleration = new THREE.Vector3(50, .25, 50);
        this.speed = 5;

        this.character = character;
        this.direction = new Vector3();

        this.isCanJump = false;
    }

    init() {
        this.character.cannon.addEventListener("collide", (e: any) => {
            const contactNormal = new CANNON.Vec3();
            const upAxis = new CANNON.Vec3(0, 1, 0);
            const { contact } = e;

            if(contact.bi.id === this.character.cannon.id) contact.ni.negate(contactNormal);
            else contactNormal.copy(contact.ni);

            if(contactNormal.dot(upAxis) > 0.5) this.isCanJump = true;
        });
    }

    setCharacter(character: Entity) {
        this.character = character;
        this.animationManager.setCharacter(character);
        this.init();
    }

    getDirection() {
        const target = new THREE.Vector3();
        this.character.three.getWorldDirection(target);
        target.y = 0;
        target.normalize();
        return target;
    }

    getDirectionSide() {
        const target = new THREE.Vector3();
        this.character.three.getWorldDirection(target);
        target.y = 0;
        target.normalize();
        target.cross(this.character.three.up);
        return target;
    }

    addVector(vector: CANNON.Vec3) {
        this.character.cannon.position.x += vector.x;
        this.character.cannon.position.z += vector.z;
    }

    animate(delta: number, angleX: number) {
        this.character.cannon.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 1), 0);

        const quatByAngleX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI / 180 * -angleX));
        this.character.cannon.quaternion.copy(Utils.tToC().quaternion(quatByAngleX));

        const { forward, backward, left, right, space } = this.keyboardManager.keys;

        const direction = this.getDirection();
        const directionSide = this.getDirectionSide();

        if(forward) this.addVector(Utils.tToC().vector3(direction.multiplyScalar(this.speed * delta)));
        if(backward) this.addVector(Utils.tToC().vector3(direction.multiplyScalar(-this.speed * delta)));
        if(right) this.addVector(Utils.tToC().vector3(directionSide.multiplyScalar(this.speed * delta)));
        if(left) this.addVector(Utils.tToC().vector3(directionSide.multiplyScalar(-this.speed * delta)));

        if(space && this.isCanJump) {
            this.character.cannon.velocity.y = 7;
            this.isCanJump = false;
        }
    }
}