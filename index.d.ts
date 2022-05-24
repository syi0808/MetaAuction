declare module "*.glsl" {
    const content: string;
    export default content;
}

declare global {
}

interface Element {
    setClassName(name: string): void;
}