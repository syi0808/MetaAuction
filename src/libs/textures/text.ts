import * as THREE from 'three';

interface Option {
    text: string | string[];
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    color?: string;
}

export class TextTexture {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    textrue: THREE.CanvasTexture;
    option: Required<Option>;

    constructor({
        text,
        width = 1000,
        height = 1000,
        fontFamily = "Noto Sans KR",
        fontSize = 100,
        fontWeight = 900,
        color = "#000000",
    }: Option) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.textrue = new THREE.CanvasTexture(this.canvas);

        this.option = {
            text,
            width,
            height,
            fontFamily,
            fontSize,
            fontWeight,
            color,
        };

        this.init();
    }

    init() {
        const { width, height } = this.option;

        this.canvas.width = width;
        this.canvas.height = height;

        this.render();
    }

    update(option: Partial<Option>) {
        this.option = { ...this.option, ...option };
        this.render();
    }

    render() {
        const {
            text,
            width,
            height,
            fontFamily,
            fontSize,
            fontWeight,
            color,
        } = this.option;

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(0, 0, width, height);

        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        if(typeof text === "string") this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        else text.forEach((text, i) => this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + i * fontSize));
    }
}