export class MouseManager {
    angleX: number;
    angleY: number;
    speed: number;
    isLocked: boolean;

    constructor() {
        this.angleX = 0;
        this.angleY = 0;
        this.speed = 3;
        this.isLocked = false;

        window.addEventListener("mousemove", this.onMousemove.bind(this));
        window.addEventListener("click", () => document.body.requestPointerLock());
        document.addEventListener("pointerlockchange", () => {
            if(document.pointerLockElement) this.isLocked = true;
            else this.isLocked = false;
        });
    }

    onMousemove(e: MouseEvent) {
        this.angleX += e.movementX / 10 * this.speed;
        this.angleY += e.movementY / 10 * this.speed;
    }

    getAngleY() {
        if(this.angleY < -90) this.angleY = -90;
        else if(this.angleY > 220) this.angleY = 220;
        return this.angleY;
    }

    getAngleX() {
        return this.angleX;
    }
}