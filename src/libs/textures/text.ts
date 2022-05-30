import * as THREE from 'three';

interface Option {
    text: string;
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    color?: string;
}

export const createTextTextrue = ({
    text,
    width = 1000,
    height = 1000,
    fontFamily = "Noto Sans KR",
    fontSize = 100,
    fontWeight = 900,
    color = "#000000",
}: Option) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}