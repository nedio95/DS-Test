import { utils } from "pixi.js";
export default class Keyboard extends utils.EventEmitter {
    static instance;
    static states = {
        ACTION: "ACTION",
    };
    static actions = {
        DOWN: "DOWN",
        LEFT: "LEFT",
        RIGHT: "RIGHT",
    };
    static actionKeyMap = {
        [Keyboard.actions.DOWN]: "KeyS",
        [Keyboard.actions.LEFT]: "KeyA",
        [Keyboard.actions.RIGHT]: "KeyD",
    };
    static allKeys = Object.values(Keyboard.actionKeyMap);
    static keyActionMap = Object.entries(Keyboard.actionKeyMap).reduce((acc, [key, action]) => {
        acc[action] = key;
        return acc;
    }, {});
    keyMap = new Map();
    constructor() {
        super();
        this.listenToKeyEvents();
    }
    listenToKeyEvents() {
        document.addEventListener("keydown", (e) => this.onKeyPress(e.code));
        document.addEventListener("keyup", (e) => this.onKeyRelease(e.code));
    }
    static getInstance() {
        if (!Keyboard.instance) {
            Keyboard.instance = new Keyboard();
        }
        return Keyboard.instance;
    }
    getAction(action) {
        return this.isKeyDown(Keyboard.actionKeyMap[action]);
    }
    onAction(callback) {
        this.on(Keyboard.states.ACTION, callback);
    }
    onKeyPress(key) {
        if (this.isKeyDown(key) || !(key in Keyboard.keyActionMap))
            return;
        this.keyMap.set(key, true);
        this.emit(Keyboard.states.ACTION, {
            action: Keyboard.keyActionMap[key],
            buttonState: "pressed",
        });
    }
    onKeyRelease(key) {
        if (!(key in Keyboard.keyActionMap))
            return;
        this.keyMap.set(key, false);
        this.emit(Keyboard.states.ACTION, {
            action: Keyboard.keyActionMap[key],
            buttonState: "released",
        });
    }
    isKeyDown(key) {
        return this.keyMap.get(key) ?? false;
    }
}
//# sourceMappingURL=Keyboard.js.map