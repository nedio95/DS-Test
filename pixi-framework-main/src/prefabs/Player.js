import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
//import SpritesheetAnimation from "../core/SpritesheetAnimation";
import Keyboard from "../core/Keyboard";
//import { wait } from "../utils/misc";
/*
enum Directions {
  LEFT = -1,
  PASSIVE = 0,
  RIGHT = 1,
}
  */
const sixtyDegree = (Math.PI * 0.333);
const crazySpin = 1000; //is 1000 crazy enough of a spin ?
const gameNumbers = 3; //How many numbers this combination lock has. 
/*
type AnimState = {
  anim: string;
  soundName?: string;
  loop?: boolean;
  speed?: number;
};
*/
/**
 * Example class showcasing the usage of the```Animation``` and ```Keyboard``` classes
 */
export class Player extends Container {
    keyboard = Keyboard.getInstance();
    anim; //I have no idea why, but if I try to create a sprite with ANY other name this breaks
    gameState = 0;
    currentDirection = 0;
    currentRotation = 0;
    startingNumbers = [0, 0, 0]; //ideally this would not be hardcoded
    //private currentRotation = 0.0;
    targetPosition = 0;
    targetDirection = 0;
    //currentState: AnimState | null = null;
    /*
    static animStates: Record<string, AnimState> = {
      idle: {
        anim: "idle",
        loop: true,
        speed: 0.3,
      },
      jump: {
        anim: "jump",
        soundName: "jump2",
        loop: false,
        speed: 0.5,
      },
      walk: {
        anim: "walk",
        loop: true,
        speed: 1,
      },
      dash: {
        anim: "dash",
        soundName: "dash",
        loop: false,
        speed: 1,
      },
    };
    
    config = {
      speed: 10,
      turnDuration: 0.15,
      decelerateDuration: 0.1,
      scale: 1,
      jump: {
        height: 200,
        duration: 0.3,
        ease: "sine",
      },
      dash: {
        speedMultiplier: 6,
        duration: 0.1,
      },
    };
  
    state = {
      jumping: false,
      dashing: false,
      velocity: {
        x: 0,
        y: 0,
      },
    };
  
    private decelerationTween?: gsap.core.Tween;
    */
    constructor() {
        super();
        this.anim = Sprite.from("handle");
        this.anim.anchor.set(0.5);
        this.addChild(this.anim);
        this.resetGame();
        //this.setState(Player.animStates.idle);
        this.keyboard.onAction(({ action, buttonState }) => {
            if (buttonState === "pressed") {
                this.onActionPress(action);
                this.gameUpdate();
                this.updateAnimation();
            }
            //else if (buttonState === "released") this.onActionRelease(action);
        });
    }
    /*
    setState(state: AnimState) {
      this.currentState = state;
  
      return this.anim.play(state);
    }
    */
    resetGame() {
        console.log("Game is reset");
        this.gameState = 0;
        this.currentDirection = (Math.random() >= 0.5) ? 1 : -1;
        this.currentRotation = 0;
        this.startingNumbers = [Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * 8 + 1)];
        this.targetPosition = 0;
        this.targetDirection = 0;
        gsap.to(this.anim, {
            rotation: crazySpin, duration: 1
        });
        gsap.to(this.anim, {
            rotation: 0, duration: 1
        });
        console.log("starting numbers are: " + this.startingNumbers);
        console.log("starting dir is: " + this.currentDirection);
    }
    onActionPress(action) {
        switch (action) {
            case "LEFT":
                this.setDirection(-1);
                //if(this.targetPosition < -9) this.targetPosition += 9;
                break;
            case "RIGHT":
                this.setDirection(1);
                //if(this.targetPosition > 9) this.targetPosition -= 9;
                break;
            case "DOWN":
                this.MakeGuess();
                //check if at correct number
                //Yes -> move to next game state
                //No -> Game Over -> Restart
                break;
            default:
                break;
        }
    }
    setDirection(value) {
        this.targetPosition += value;
        this.targetDirection = value;
        this.currentRotation += value;
    }
    MakeGuess() {
        if (Math.abs(this.targetPosition) != this.startingNumbers[this.gameState]) {
            this.resetGame();
            console.log("GameOver due to Wrong Guess");
            return;
        }
        if (this.gameState == gameNumbers - 1) {
            //Game Over -> VICTORY
            console.log("GameOver due to VICTORY");
            return;
        }
        console.log("Good Guess");
        this.gameState += 1;
        this.targetPosition = 0;
        this.currentDirection *= -1;
        this.targetDirection = this.currentDirection;
        console.log("Gamestate is now: " + this.gameState);
    }
    gameUpdate() {
        if (this.targetDirection != this.currentDirection) {
            this.resetGame();
            console.log("GameOver due to wrong direction");
            return;
        }
        if (Math.abs(this.targetPosition) > this.startingNumbers[this.gameState]) {
            this.resetGame();
            console.log("GameOver due to overrotation");
            return;
        }
    }
    updateAnimation() {
        //if(this.targetPosition == 0) return;
        console.log("Rot" + this.anim.rotation);
        console.log("Length" + this.targetPosition);
        //this.anim.rotation += 1;
        //let rotateMe:boolean = true;
        gsap.to(this.anim, {
            rotation: ( /*this.anim.rotation*/(this.currentRotation * sixtyDegree))
        });
        /*
        do
        {
          let currentRotation = this.anim.rotation;
          let targetRotation = this.targetDirection;
          if((currentRotation-targetRotation)<0.05)
            {
              this.anim.rotation = targetRotation;
              rotateMe = false;
            }
        }while(rotateMe);
        */
    }
}
//# sourceMappingURL=Player.js.map