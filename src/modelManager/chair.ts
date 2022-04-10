import { Model } from '.';

export class ChairModel extends Model {
    color: number;

    constructor() {
        super();

        this.color = 0xdddce8;
        this.init();
    }

    init() {
        // Chair Leg
        this.group.add(this.createLeg(1, 1));
        this.group.add(this.createLeg(-1, 1));
        this.group.add(this.createLeg(1, -1));
        this.group.add(this.createLeg(-1, -1));

        // Chair Body
        this.group.add(this.createBody());

        // Chair Back
        this.group.add(this.createLeg(-1, -1, 2));
        this.group.add(this.createLeg(1, -1, 2));
        this.group.add(this.createBack());
    }

    createLeg(x: number ,z: number, y?: number) {
        return this.createBox({
            size: [.3, 2, .3],
            position: [x, y ?? 0, z],
            color: this.color,
        });
    }

    createBack() {
        return this.createBox({
            size: [2.3, 1, 0.25],
            position: [0, 2.4, -1],
            color: this.color,
        });
    }

    createBody() {
        return this.createBox({
            size: [2.3, .2, 2.3],
            position: [0, 1, 0],
            color: this.color,
        });
    }
}