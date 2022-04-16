import { Object3D } from "three";
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Utils } from "../utils";

export class Entity {
    three: Object3D;
    cannon: CANNON.Body;
    isModel: boolean;
    sizeVector?: THREE.Vector3;

    constructor(three: Object3D, cannon: CANNON.Body, isModel?: boolean) {
        this.three = three,
        this.cannon = cannon;
        this.isModel = Boolean(isModel);

        this.init();
    }

    init() {
        this.three.traverse(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        });
    }

    getSize() {
        if(this.sizeVector) return this.sizeVector;
        const box3 = new THREE.Box3().setFromObject(this.three);
        this.sizeVector = new THREE.Vector3();
        box3.getSize(this.sizeVector);
        return this.sizeVector;
    }

    animate() {
        this.three.position.copy(Utils.cToT().vector3(this.cannon.position));
        this.three.quaternion.copy(Utils.cToT().quaternion(this.cannon.quaternion));
        
        if(this.isModel) {
            this.three.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -this.getSize().y / 2, 0));
            this.three.updateMatrix();
        }

        if(this.cannon.position.y < -10) {
            this.cannon.position.set(0, 3, 0);
            this.cannon.velocity.setZero();
        }
    }
}