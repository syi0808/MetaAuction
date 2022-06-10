import { Model } from '.';

export class ShowroomModel extends Model {
    color: number;
    size: number;
    height: number;

    constructor() {
        super();

        this.color = 0xdddce8;
        this.size = 20;
        this.height = 15;
        this.init();
    }

    init() {
        // Floor
        this.group.add(this.createFloor());

        // Wall
        const halfSize = this.size / 2;
        this.group.add(this.createWallVertical(halfSize));
        this.group.add(this.createWallVertical(-halfSize));
        this.group.add(this.createWallHorizontal(halfSize));
        this.group.add(this.createWallHorizontal(-halfSize));

        // Ceil
        // this.group.add(this.createCeil());
    }

    createCeil() {
        return this.createBox({
            size: [this.size, .4, this.size],
            color: this.color,
            position: [0, this.height, 0],
        })
    }

    createFloor() {
        return this.createBox({
            size: [this.size, .4, this.size],
            color: this.color,
        });
    }

    createWallVertical(z: number) {
        return this.createBox({
            size: [this.size, this.height, .4],
            position: [0, this.height / 2, z],
            color: this.color,
        });
    }

    createWallHorizontal(x: number) {
        return this.createBox({
            size: [.4, this.height, this.size],
            position: [x, this.height / 2, 0],
            color: this.color,
        });
    }
}