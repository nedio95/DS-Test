import { Application } from "pixi.js";
import AssetLoader from "./AssetLoader";
export default class SceneManager {
    sceneConstructors = this.importScenes();
    app;
    sceneInstances = new Map();
    currentScene;
    constructor() {
        this.app = new Application({
            view: document.querySelector("#app"),
            autoDensity: true,
            resizeTo: window,
            powerPreference: "high-performance",
            backgroundColor: 0x23272a,
        });
        // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
        window.__PIXI_APP__ = this.app;
        window.addEventListener("resize", (ev) => {
            const target = ev.target;
            this.currentScene?.onResize?.(target.innerWidth, target.innerHeight);
        });
        this.app.ticker.add(() => {
            this.currentScene?.update?.(this.app.ticker.elapsedMS);
        });
    }
    importScenes() {
        const sceneModules = import.meta.glob("/src/scenes/*.ts", {
            eager: true,
        });
        return Object.entries(sceneModules).reduce((acc, [path, module]) => {
            const fileName = path.split("/").pop()?.split(".")[0];
            if (!fileName)
                throw new Error("Error while parsing filename");
            acc[fileName] = module.default;
            return acc;
        }, {});
    }
    async switchScene(sceneName, deletePrevious = true) {
        await this.removeScene(deletePrevious);
        this.currentScene = this.sceneInstances.get(sceneName);
        if (!this.currentScene)
            this.currentScene = await this.initScene(sceneName);
        if (!this.currentScene)
            throw new Error(`Failed to initialize scene: ${sceneName}`);
        this.app.stage.addChild(this.currentScene);
        if (this.currentScene.start)
            await this.currentScene.start();
        return this.currentScene;
    }
    async removeScene(destroyScene) {
        if (!this.currentScene)
            return;
        if (destroyScene) {
            this.sceneInstances.delete(this.currentScene.name);
            this.currentScene.destroy({ children: true });
        }
        else {
            this.app.stage.removeChild(this.currentScene);
        }
        if (this.currentScene.unload)
            await this.currentScene.unload();
        this.currentScene = undefined;
    }
    async initScene(sceneName) {
        const sceneUtils = {
            assetLoader: new AssetLoader(),
        };
        const scene = new this.sceneConstructors[sceneName](sceneUtils);
        this.sceneInstances.set(sceneName, scene);
        if (scene.load)
            await scene.load();
        return scene;
    }
}
//# sourceMappingURL=SceneManager.js.map