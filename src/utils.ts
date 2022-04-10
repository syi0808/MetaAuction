import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Utils {
    constructor() {

    }

    static tToC() {
        return {
            vector3: ({ x, y, z }: THREE.Vector3) => new CANNON.Vec3(x, y, z),
            quaternion: ({ x, y, z, w }: THREE.Quaternion) => new CANNON.Quaternion(x, y, z, w),
        }
    }

    static cToT() {
        return {
            vector3: ({ x, y, z }: CANNON.Vec3) => new THREE.Vector3(x, y, z),
            quaternion: ({ x, y, z, w }: CANNON.Quaternion) => new THREE.Quaternion(x, y, z, w),
        }
    }
}