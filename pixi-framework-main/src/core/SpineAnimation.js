import { Assets } from "pixi.js";
import { Spine, } from "@pixi-spine/runtime-4.1";
import Deferred from "../utils/Deferred";
export default class SpineAnimation extends Spine {
    playingLabel = null;
    animDeferred;
    animStateListener = {
        complete: (trackEntry) => {
            if (trackEntry.animation?.name === this.playingLabel) {
                this.animDeferred?.resolve();
                this.playingLabel = null;
            }
        },
        interrupt: () => {
            this.animDeferred?.resolve();
            this.playingLabel = null;
        },
    };
    constructor(name, skin) {
        const spineData = Assets.cache.get(name)?.spineData;
        if (!spineData)
            throw new Error(`Spine data for ${name} not found!`);
        super(spineData);
        this.state.addListener(this.animStateListener);
        this.name = name;
        if (skin)
            this.setSkin(skin);
    }
    play(name, loop = false) {
        this.state.setAnimation(0, name, loop);
        this.playingLabel = name;
        this.animDeferred = new Deferred();
        return this.animDeferred.promise;
    }
    hasSkin(name) {
        return this.skeleton.data.skins.find((skin) => skin.name === name);
    }
    setSkin(skin, resetPose = true) {
        if (!this.hasSkin(skin)) {
            throw new Error(`Skin ${skin} not found in ${this.name}`);
        }
        this.skeleton.setSkinByName(skin);
        if (resetPose)
            this.skeleton.setSlotsToSetupPose();
    }
    get skin() {
        return this.skeleton.skin?.name;
    }
}
//# sourceMappingURL=SpineAnimation.js.map