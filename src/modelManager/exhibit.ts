import { Model } from '.';
import * as THREE from 'three';
import { TextTexture } from '../libs/textures/text';

export interface Exhibit {
    title: string;
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

        //

        this.group.rotateY(-Math.PI / 2);
        this.group.position.y = 3;
    }

    createBody() {
        return this.createBox({
            size: [2, 1.4, 2],
            color: this.color,
        });
    }
}