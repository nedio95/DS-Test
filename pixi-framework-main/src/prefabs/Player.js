import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
//import SpritesheetAnimation from "../core/SpritesheetAnimation";
import Keyboard from "../core/Keyboard";
//import { wait } from "../utils/misc";
const sixtyDegree = (Math.PI * 0.333);
const crazySpin = 1000; //is 1000 crazy enough of a spin ?
const gameNumbers = 3; //How many numbers this combination lock has.
let shadowOffset = 20;
export class Player extends Container {
    keyboard = Keyboard.getInstance();
    //private door: Sprite;
    doorHandle;
    handleShadow;
    gameState = 0; //This tracks at what stage the player is: 0 - No correct guesses, 1 - one correct guess, 2 - two correct guesses 
    currentDirection = 0; // This tracks what direction the player needs to spin for the current numnber
    currentRotation = 0; // This tracks at what direction the sprite should be rotated
    startingNumbers = [0, 0, 0]; //The rotation numbers to be made. Ideally this would not be hardcoded
    targetPosition = 0; //Tracks what position the player is at
    targetDirection = 0; //Tracks which direction the player is rotating
    constructor() {
        super();
        /*
        this.door = Sprite.from("door");
        this.door.anchor.set(0.5);
        this.addChild(this.door);
        */
        this.handleShadow = Sprite.from("handleShadow");
        this.handleShadow.anchor.set(0.5);
        this.addChild(this.handleShadow);
        this.doorHandle = Sprite.from("handle");
        this.doorHandle.anchor.set(0.5);
        this.handleShadow.x += shadowOffset;
        this.handleShadow.y += shadowOffset;
        this.handleShadow.alpha = 0.75;
        this.addChild(this.doorHandle);
        //reset the game logic
        this.resetGame();
        //Detect keyboard input and run logic
        this.keyboard.onAction(({ action, buttonState }) => {
            if (buttonState === "pressed") {
                this.onActionPress(action);
                this.gameUpdate();
                this.updateAnimation((this.currentRotation * sixtyDegree), 0.5);
            }
        });
    }
    resetGame() {
        console.log("Game is reset");
        this.gameState = 0;
        this.currentDirection = (Math.random() >= 0.5) ? 1 : -1;
        this.currentRotation = 0;
        this.startingNumbers = [Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * 8 + 1), Math.floor(Math.random() * 8 + 1)];
        console.log("Your numbers are: " + this.startingNumbers);
        console.log("The starting direction is: " + this.currentDirection);
        this.targetPosition = 0;
        this.targetDirection = 0;
        this.doorHandle.rotation = crazySpin;
        this.handleShadow.rotation = crazySpin;
        this.updateAnimation(0, 1);
    }
    onActionPress(action) {
        switch (action) {
            case "LEFT":
                this.setDirection(-1);
                break;
            case "RIGHT":
                this.setDirection(1);
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
    //Takes user input to modify the target numbers
    setDirection(value) {
        this.targetPosition += value;
        this.targetDirection = value;
        this.currentRotation += value;
    }
    MakeGuess() {
        if (Math.abs(this.targetPosition) != this.startingNumbers[this.gameState]) //If the player has locked in a wrong number
         {
            //Game over due to a wrong guess
            this.resetGame();
            console.log("GameOver due to Wrong Guess");
            return;
        }
        if (this.gameState == gameNumbers - 1) //if this is the final number and it is correct
         {
            //Game Over due to VICTORY
            console.log("GameOver due to VICTORY - You won!");
            gsap.to(this.handleShadow, {
                x: screen.height * 2, y: -screen.width * 2, rotation: crazySpin, duration: 1
            });
            gsap.to(this.doorHandle, {
                x: screen.height * 2, y: -screen.width * 2, rotation: crazySpin, duration: 1
            });
            return;
        }
        //Move to the next game state due to a correct guess
        console.log("Good Guess, next number, please");
        this.gameState += 1;
        this.targetPosition = 0;
        this.currentDirection *= -1;
        this.targetDirection = this.currentDirection;
    }
    gameUpdate() {
        if (this.gameState >= gameNumbers)
            return;
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
    updateAnimation(rotateBy, durationLen) {
        gsap.to(this.handleShadow, {
            rotation: rotateBy, duration: durationLen
        });
        gsap.to(this.doorHandle, {
            rotation: rotateBy, duration: durationLen
        });
    }
}
//# sourceMappingURL=Player.js.map