import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Object3D, Scene } from "three";
import { threeToCannon, ShapeType as CannonShapeType } from 'three-to-cannon';
import { Entity } from "./entity";
import { Model } from "../modelManager";
import { ShapeType } from "../physcisManager";
import { Utils } from "../utils";

interface Option {
    type?: CannonShapeType;
    mass?: number;
    isModel?: boolean;
}

interface AddModelOption {
    mass?: number;
    position?: [number, number, number];
    degree?: [number, number, number];
    scale?: [number, number, number];
    isModel?: boolean;
}

export class EntityManager {
    world: CANNON.World;
    scene: Scene;
    entities: Entity[];

    constructor(scene: Scene, world: CANNON.World) {
        this.world = world;
        this.scene = scene;
        this.entities = [];
    }

    addCustom(model: Object3D, {
        mass = 1,
        position = [0, 0, 0],
        scale = [1, 1, 1],
        isModel
    }: AddModelOption) {
        const halfExtents = Utils.tToC().vector3(new THREE.Vector3(...scale).divideScalar(2));
        const body = new CANNON.Body({
            mass,
            position: new CANNON.Vec3(...position),
            shape: new CANNON.Box(halfExtents),
            linearDamping: .5,
            angularDamping: 1,
        });
        const entity = new Entity(model, body, isModel);

        this.entities.push(entity);
        this.world.addBody(body);
        this.scene.add(model);

        return entity;
    }

    addModel(model: Model, {
        mass = 1,
        position = [0, 0, 0],
        degree = [0, 0, 0],
        scale = [1, 1, 1],
    }: AddModelOption) {
        const body = new CANNON.Body({
            mass,
            position: new CANNON.Vec3(...position),
            quaternion: new CANNON.Quaternion().setFromEuler(...degree.map(n => Math.PI / 180 * n) as [number, number, number]),
        });
        const entity = new Entity(model.group, body);

        model.group.position.copy(new THREE.Vector3(...position));
        model.group.scale.copy(new THREE.Vector3(...scale));

        model.group.traverse(child => {
            const { userData, position, quaternion } = child;
            switch(userData.type) {
                case ShapeType.Box: {
                    const box3 = new THREE.Box3().setFromObject(child);
                    const size = new THREE.Vector3();
                    box3.getSize(size);
                    body.addShape(
                        new CANNON.Box(Utils.tToC().vector3(size.divideScalar(2))),
                        Utils.tToC().vector3(position),
                        Utils.tToC().quaternion(quaternion),
                    );
                    break;
                }
            }
        });

        this.entities.push(entity);
        this.world.addBody(body);
        this.scene.add(model.group);
        
        return entity;
    }

    addObject3D(object: Object3D, option?: Option, originObject?: Object3D) {
        const result = threeToCannon(object as any, { type: option?.type });
        const body = new CANNON.Body({
            mass: option?.mass ?? 1,
            position: result?.offset,
            shape: result?.shape,
        });
        this.world.addBody(body);

        let entity: Entity;
        if(originObject) {
            entity = new Entity(originObject, body, option?.isModel);
            this.scene.add(originObject)
        } else {
            entity = new Entity(object, body, option?.isModel);
            this.scene.add(object);
        }

        this.entities.push(entity);

        return entity;
    }

    animate() {
        this.entities.forEach(e => e.animate());
    }
}