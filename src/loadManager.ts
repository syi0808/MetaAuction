import * as THREE from 'three'
import { LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

type ModelsType = { [key: string]: THREE.Group };

interface ProgressEvent {
    loadedPercent: number;
}

const loadMaxCount = 2;

export class LoadManager {
    manager: LoadingManager;
    onLoadCallback: () => void;
    onProgressCallback: (e: ProgressEvent) => void;

    static completeCount = 0;
    static progress = 0;

    constructor() {
        this.manager = new THREE.LoadingManager();
        this.onLoadCallback = () => {};
        this.onProgressCallback = () => {};
    }

    load(paths: string[]): Promise<ModelsType> {
        return new Promise((res, rej) => {
            const loader = new FBXLoader(this.manager);
            const models: ModelsType = {};

            paths.forEach(path => {
                loader.load(path, model => models[path] = model);
            });

            this.manager.onLoad = () => {
                res(models);
                LoadManager.completeCount += 1;
                if(LoadManager.completeCount === loadMaxCount) this.onLoadCallback();
            }

            this.manager.onProgress = (_url, loaded, total) => {
                LoadManager.progress = (loaded / total * 100) / loadMaxCount - LoadManager.completeCount;
                this.onProgressCallback({ loadedPercent: LoadManager.progress });
            }
            this.manager.onError = rej;
        });
    }

    addEventListener(event: "load" | "progress", callback: () => void | ((e: ProgressEvent) => void)) {
        switch(event) {
            case "load":
                return this.onLoadCallback = callback;
            case "progress":
                return this.onProgressCallback = callback;
        }
    }
}