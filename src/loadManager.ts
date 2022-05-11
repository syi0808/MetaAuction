import * as THREE from 'three'
import { LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

type ModelsType = { [key: string]: THREE.Group };

interface ProgressEvent {
    loadedPercent: number;
}

type EventTypes = "load" | "progress";

interface Event {
    load: () => void;
    progress: (e: ProgressEvent) => void;
}

export class LoadManager {
    onLoadCallbacks: (() => void)[];
    onProgressCallbacks: ((e: ProgressEvent) => void)[];
    completeCount: number;
    maxCount: number;
    progress: number;

    constructor(maxCount: number) {
        this.onLoadCallbacks = [];
        this.onProgressCallbacks = [];
        this.completeCount = 0;
        this.maxCount = maxCount;
        this.progress = 0;
    }

    createFBXLoader() {
        return new Loader(this.onLoad.bind(this), this.onProgress.bind(this));
    }

    onLoad() {
        this.completeCount += 1;
        if(this.completeCount === this.maxCount) this.onLoadCallbacks.forEach(c => c());
    }

    onProgress(percent: number) {
        this.progress += percent / this.maxCount;
        this.onProgressCallbacks.forEach(c => c({ loadedPercent: this.progress }));
    }

    addEventListener<E extends EventTypes>(event: E, callback: Event[E]) { 
        switch(event) {
            case "load":
                return this.onLoadCallbacks.push(callback as Event["load"]);
            case "progress":
                return this.onProgressCallbacks.push(callback as Event["progress"]);
        }
    }
}

export class Loader {
    manager: LoadingManager;
    onLoad: () => void;
    onProgress: (percent: number) => void;

    constructor(onLoad: () => void, onProgress: (percent: number) => void) {
        this.manager = new THREE.LoadingManager();
        this.onLoad = onLoad;
        this.onProgress = onProgress;
    }

    load(paths: string[]): Promise<ModelsType> {
        return new Promise((res, rej) => {
            const loader = new FBXLoader(this.manager);
            const models: ModelsType = {};
            let prevPercent: number = 0;

            paths.forEach(path => {
                loader.load(path, model => models[path] = model);
            });

            this.manager.onLoad = () => {
                res(models);
                this.onLoad();
            }
            this.manager.onProgress = (_url, loaded, total) => {
                this.onProgress(loaded / total * 100 - prevPercent);
                prevPercent = loaded / total * 100;
            }
            this.manager.onError = rej;
        });
    }
}