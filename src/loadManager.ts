import * as THREE from 'three'
import { LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

type ModelsType<T extends string> = { [key in T]: THREE.Group };
type EventTypes = "load" | "progress";

interface ProgressEvent {
    loadedPercent: number;
}


interface EventCallback {
    load: () => void;
    progress: (e: ProgressEvent) => void;
}

export class LoadManager {
    onLoadCallbacks: EventCallback["load"][];
    onProgressCallbacks: EventCallback["progress"][];
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

    onProgress({ loadedPercent }: ProgressEvent) {
        this.progress += loadedPercent / this.maxCount;
        this.onProgressCallbacks.forEach(c => c({ loadedPercent: this.progress }));
    }

    addEventListener<E extends EventTypes>(eventCallback: E, callback: EventCallback[E]) {
        switch(eventCallback) {
            case "load":
                this.onLoadCallbacks.push(callback as EventCallback["load"]);
                break;
            case "progress":
                this.onProgressCallbacks.push(callback as EventCallback["progress"]);
                break;
        }
    }
}

export class Loader {
    manager: LoadingManager;
    onLoad: EventCallback["load"];
    onProgress: EventCallback["progress"];

    constructor(onLoad: EventCallback["load"], onProgress: EventCallback["progress"]) {
        this.manager = new THREE.LoadingManager();
        this.onLoad = onLoad;
        this.onProgress = onProgress;
    }

    load<T extends string>(paths: T[]): Promise<ModelsType<T>> {
        return new Promise((res, rej) => {
            const loader = new FBXLoader(this.manager);
            const models = {} as ModelsType<T>;
            let prevPercent: number = 0;

            paths.forEach(path => loader.load(path, model => models[path] = model));

            this.manager.onLoad = () => {
                res(models);
                this.onLoad();
            }
            this.manager.onProgress = (_url, loaded, total) => {
                this.onProgress({ loadedPercent: loaded / total * 100 - prevPercent });
                prevPercent = loaded / total * 100;
            }
            this.manager.onError = rej;
        });
    }
}