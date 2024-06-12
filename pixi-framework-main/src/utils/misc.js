import { Sprite } from "pixi.js";
export function centerObjects(...toCenter) {
    const center = (obj) => {
        obj.x = window.innerWidth / 2;
        obj.y = window.innerHeight / 2;
        if (obj instanceof Sprite) {
            obj.anchor.set(0.5);
        }
    };
    toCenter.forEach(center);
}
export function wait(seconds) {
    return new Promise((res) => setTimeout(res, seconds * 1000));
}
export async function after(seconds, callback) {
    await wait(seconds);
    return callback();
}
export function getEntries(obj) {
    return Object.entries(obj);
}
//# sourceMappingURL=misc.js.map