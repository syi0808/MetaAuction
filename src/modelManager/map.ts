import { Model } from '.';

export class MapModel extends Model {
    color: number;

    constructor() {
        super();

        this.color = 0xdddce8;
        this.init();
    }

    init() {
        // Floor
        this.group.add(this.createFloor());

        this.group.traverse(child => {
            child.receiveShadow = true;
        });
    }

    createFloor() {
        return this.createBox({
            size: [30, .4, 30],
            color: this.color,
        });
    }
}