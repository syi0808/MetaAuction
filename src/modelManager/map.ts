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
        // this.group.add(this.createWallVertical(15));
        // this.group.add(this.createWallVertical(-15));
        // this.group.add(this.createWallHorizontal(15));
        // this.group.add(this.createWallHorizontal(-15));

        // Ceil
        // this.group.add(this.createCeil());
    }

    createCeil() {
        return this.createBox({
            size: [30, .4, 30],
            color: this.color,
            position: [0, 20, 0],
        })
    }

    createFloor() {
        return this.createBox({
            size: [30, .4, 30],
            color: this.color,
        });
    }

    createWallVertical(z: number) {
        return this.createBox({
            size: [30, 20, .4],
            position: [0, 10, z],
            color: this.color,
        });
    }

    createWallHorizontal(x: number) {
        return this.createBox({
            size: [.4, 20, 30],
            position: [x, 10, 0],
            color: this.color,
        });
    }
}