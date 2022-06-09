import { Model } from '.';
import * as THREE from 'three';
import { TextTexture } from '../libs/textures/text';
import { ImageTextrue } from '../libs/textures/image';

export type ExtraType = "image" | "model";

export interface Exhibit {
    title: string;
    type: ExtraType;
    url: string;
    price: number;
}

export class ExhibitModel extends Model {
    color: number;
    exhibit: Exhibit;

    constructor(exhibit: Exhibit) {
        super();

        this.exhibit = exhibit;
        this.color = 0xffffff;
        this.init();
    }

    init() {
        // Body
        this.group.add(this.createBody());
        const textTexture = new TextTexture({ 
            text: [this.exhibit.title, this.exhibit.price.toLocaleString('ko-KR')],
            fontSize: 120,
        });
        this.group.add(new THREE.Mesh(
            new THREE.BoxGeometry(2.01, 1.5, 2.01),
            [new THREE.MeshBasicMaterial({
                map: textTexture.textrue,
                transparent: true,
            })],
        ));

        //Image or 3DModel
        switch(this.exhibit.type) {
            case "image": {
                const mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(2, 2),
                    new THREE.MeshBasicMaterial({
                        map: new ImageTextrue(this.exhibit.url).texture,
                    })
                );
                mesh.material.map!.needsUpdate = true;
                mesh.position.y = 1.5;
                mesh.rotateY(Math.PI / 2);
                this.group.add(mesh);
                break;
            }
            case "model": {
                break;
            }
        }
    }

    createBody() {
        return this.createBox({
            size: [2, 1.4, 2],
            color: this.color,
        });
    }
}