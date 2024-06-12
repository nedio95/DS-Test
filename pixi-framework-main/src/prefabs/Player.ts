import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
//import SpritesheetAnimation from "../core/SpritesheetAnimation";
import Keyboard from "../core/Keyboard";
//import { wait } from "../utils/misc";

const sixtyDegree = (Math.PI*0.333);
const crazySpin = 1000; //is 1000 crazy enough of a spin ?
const gameNumbers = 3; //How many numbers this combination lock has. 

export class Player extends Container {
  private keyboard = Keyboard.getInstance();
  
  private doorHandle: Sprite;
  private handleShadow: Sprite;

  private gameState = 0; //This tracks at what stage the player is: 0 - No correct guesses, 1 - one correct guess, 2 - two correct guesses 
  private currentDirection = 0; // This tracks what direction the player needs to spin for the current numnber
  private currentRotation = 0; // This tracks at what direction the sprite should be rotated
  private startingNumbers = [0, 0, 0]; //The rotation numbers to be made. Ideally this would not be hardcoded

  private targetPosition = 0; //Tracks what position the player is at
  private targetDirection = 0; //Tracks which direction the player is rotating

  constructor() 
  {
    super();

    this.handleShadow = Sprite.from("handleShadow");
    this.handleShadow.anchor.set(0.5);
    this.addChild(this.handleShadow);
    this.doorHandle = Sprite.from("handle");
    this.doorHandle.anchor.set(0.5);
    this.doorHandle.x += 5;
    this.doorHandle.y -= 5;
    this.doorHandle.alpha = 0.75;
    this.addChild(this.doorHandle);
    

    //reset the game logic
    this.resetGame();
    
    //Detect keyboard input and run logic
    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") 
        {
          this.onActionPress(action);
          this.gameUpdate();
          this.updateAnimation((this.currentRotation * sixtyDegree), 0.5);
        }
    });
    
  }

  private resetGame()
  {
    console.log("Game is reset");
    this.gameState = 0;
    this.currentDirection = (Math.random()>=0.5)? 1 : -1;
    this.currentRotation = 0;
    this.startingNumbers = [Math.floor(Math.random()*8+1), Math.floor(Math.random()*8+1), Math.floor(Math.random()*8+1)];
    this.targetPosition = 0;
    this.targetDirection = 0;
    
    this.doorHandle.rotation = crazySpin;
    this.handleShadow.rotation = crazySpin;
    this.updateAnimation(0, 1);
    
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
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
  private setDirection(value: number)
  {
    this.targetPosition += value;
    this.targetDirection = value;
    this.currentRotation += value;
  }

  private MakeGuess()
  {
    if(Math.abs(this.targetPosition) != this.startingNumbers[this.gameState]) //If the player has locked in a wrong number
      {
        //Game over due to a wrong guess
        this.resetGame();
        console.log("GameOver due to Wrong Guess")
        return;
      }
    
    if(this.gameState == gameNumbers-1) //if this is the final number and it is correct
      {
        //Game Over due to VICTORY
        console.log("GameOver due to VICTORY - You won!")
        return;
      }

    //Move to the next game state due to a correct guess
    console.log("Good Guess, next number, please")
    this.gameState += 1;
    this.targetPosition = 0;
    this.currentDirection *= -1;
    this.targetDirection = this.currentDirection;
  }

  private gameUpdate()
  {
    if(this.targetDirection != this.currentDirection) 
      {
        this.resetGame();
        console.log("GameOver due to wrong direction")
        return;
      }
    if(Math.abs(this.targetPosition) > this.startingNumbers[this.gameState])
      {
        this.resetGame();
        console.log("GameOver due to overrotation")
        return;
      }
  }
  
  
  private updateAnimation(rotateBy: number, durationLen: number)
  {    
    gsap.to(this.handleShadow, 
      {
        rotation: rotateBy, duration: durationLen
      }); 
    gsap.to(this.doorHandle, 
      {
        rotation: rotateBy, duration: durationLen 
      });
  }
}
