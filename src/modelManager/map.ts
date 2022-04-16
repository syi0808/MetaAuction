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

        // Wall
        this.group.add(this.createWallVertical(15));
        this.group.add(this.createWallVertical(-15));
        this.group.add(this.createWallHorizontal(15));
        this.group.add(this.createWallHorizontal(-15));
    }

    createFloor() {
        return this.createBox({
            size: [30, .4, 30],
            color: this.color,
        });
    }

    createWallVertical(z: number) {
        return this.createBox({
            size: [30, 40, .4],
            position: [0, 0, z],
            color: this.color,
        });
    }

    createWallHorizontal(x: number) {
        return this.createBox({
            size: [.4, 40, 30],
            position: [x, 0, 0],
            color: this.color,
        });
    }
}