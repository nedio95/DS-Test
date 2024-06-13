import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
//import SpritesheetAnimation from "../core/SpritesheetAnimation";
import Keyboard from "../core/Keyboard";
//import { wait } from "../utils/misc";
//import { ShineEffect } from "../prefabs/ShineEffect";
//import { sound } from '@pixi/sound';

const sixtyDegree = (Math.PI*0.333);
const crazySpin = 1000; //is 1000 crazy enough of a spin ?
const gameNumbers = 3; //How many numbers this combination lock has.
const shadowOffset = 0.05;  //What % of the screen space are shadows offset by
//The direction for shadows can also be moved to be customizable
//const shineOffset = 20;

const handleZ = 7;
const handleShadowZ = 6;
const doorOpenZ = 5;
//const doorOpenShadowZ = 4;
const doorZ = 3;
const shineZ = 2;

//const audioQueue = sound.add("keyClick.mp3", "../../public/Fame/sounds");

//const audioBuffer: AudioBuffer;
//const audioSource: AudioBufferSourceNode;


export class Player extends Container {
  private keyboard = Keyboard.getInstance();
  
  private door: Sprite;
  private doorOpen: Sprite;
  private doorHandle: Sprite;
  private handleShadow: Sprite;
  //private newShine: ShineEffect;
  private testShineEffect: Sprite[] = [];

  private gameState = 0; //This tracks at what stage the player is: 0 - No correct guesses, 1 - one correct guess, 2 - two correct guesses 
  private currentDirection = 0; // This tracks what direction the player needs to spin for the current numnber
  private currentRotation = 0; // This tracks at what direction the sprite should be rotated
  private startingNumbers = [0, 0, 0]; //The rotation numbers to be made. Ideally this would not be hardcoded

  private targetPosition = 0; //Tracks what position the player is at
  private targetDirection = 0; //Tracks which direction the player is rotating

  constructor() 
  {
    super();

    //audioQueue.play();
    
    //this.newShine = new ShineEffect();
    this.setShine(0);
    this.setShine(1);
    this.setShine(2);
    /*
    this.testShineEffect[0] = Sprite.from("blink");
    this.testShineEffect[1] = */
    //this.testShineEffect.anchor.set(0.5);
    //this.testShineEffect.zIndex = shineZ;
    //this.addChild(this.testShineEffect);
    
    this.door = Sprite.from("door");
    this.door.anchor.set(0.5);
    this.door.zIndex = doorZ;
    this.addChild(this.door);
    /*
    this.aShineEffect = Sprite.from("blink");
    this.addChild(this.aShineEffect);
     */

    this.doorOpen = Sprite.from("doorOpen");
    this.doorOpen.anchor.set(0.5);
    this.doorOpen.x += this.door.width/3;
    this.doorOpen.alpha = 0;
    this.doorOpen.zIndex = doorOpenZ;
    this.addChild(this.doorOpen);
    
    
    this.handleShadow = Sprite.from("handleShadow");
    this.handleShadow.anchor.set(0.5);
    this.handleShadow.zIndex = handleZ;
    this.addChild(this.handleShadow);

    this.doorHandle = Sprite.from("handle");
    this.doorHandle.anchor.set(0.5);
    this.handleShadow.x += screen.height * shadowOffset;
    this.handleShadow.y += screen.width * shadowOffset;
    this.handleShadow.alpha = 0.75;
    this.handleShadow.zIndex = handleShadowZ;
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
    console.log("Your numbers are: " + this.startingNumbers);
    console.log("The starting direction is: " + this.currentDirection);

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
    //if(Math.abs(this.targetPosition) == this.startingNumbers[this.gameState]) audioQueue.play();
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
        this.Victory();
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
    if(this.gameState >= gameNumbers) return;

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

  private Victory()
  {
    gsap.to(this.handleShadow, 
      {
        x: screen.height*2, y: -screen.width*2, rotation: crazySpin, duration: 1
      }); 
    gsap.to(this.doorHandle, 
      {
        x: screen.height*2, y: -screen.width*2, rotation: crazySpin, duration: 1 
      });
          
    let animation = gsap.timeline({});
    animation.from(this.door, {alpha:1,  stagger:1,})
      //.to(this.door, {alpha:0, stagger:0.5}, 0.5)
      .to(this.doorOpen,{alpha: 1,  duration: 0.0})
      .to(this.door,{alpha:0, duration:0.0});

    this.animateShine(0);
    this.animateShine(1);
    this.animateShine(2);
      
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

  private setShine(index: number)
  {
    this.testShineEffect[index] = Sprite.from("blink");
    this.testShineEffect[index].anchor.set(0.5);
    this.testShineEffect[index].zIndex = shineZ;
    this.addChild(this.testShineEffect[index]);
  }

  animateShine(whichShine: number)
  {  
     gsap.fromTo(this.testShineEffect[whichShine], 
      { 
        x: "random(screen.width/2, screen.width/2-200)", //screen.width/2 - screen.width*(Math.floor(Math.random()*shineOffset)/100.0),  //this is fine
        y: "random(screen.height/2, screen.height/2+500 )", //screen.height/2 - screen.height*(Math.floor(Math.random()*shineOffset)/100.0),
        duration: "random(0.5, 2.0)"
      }, 
      {
        x: "random(-100, -200)", //screen.width/2 - 1000, // screen.width*(Math.floor(Math.random()*shineOffset)/100.0+5.0), //Why is this shooting into the distance ???
        y: "random(-100, -200)", //screen.height/2 - 1000, // screen.height*(Math.floor(Math.random()*shineOffset)/100.0+5.0), //Is this working in some sort of local space ???????????????
        duration: "random(0.5, 2.0)",
        repeatRefresh: true,
        repeat: -1 //does this stop the execution of the random funtions ?
      });
  }
}
