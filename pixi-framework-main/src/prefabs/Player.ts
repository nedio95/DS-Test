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

const sixtyDegree = (Math.PI*0.333);
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
  private keyboard = Keyboard.getInstance();
  
  private anim: Sprite; //I have no idea why, but if I try to create a sprite with ANY other name this breaks

  private gameState = 0;
  private currentDirection = 0;
  private currentRotation = 0;
  private startingNumbers = [0, 0, 0]; //ideally this would not be hardcoded

  //private currentRotation = 0.0;
  private targetPosition = 0;
  private targetDirection = 0;

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
      if (buttonState === "pressed") 
        {
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

  private resetGame()
  {
    console.log("Game is reset");
    this.gameState = 0;
    this.currentDirection = (Math.random()>=0.5)? 1 : -1;
    this.currentRotation = 0;
    this.startingNumbers = [Math.floor(Math.random()*8+1), Math.floor(Math.random()*8+1), Math.floor(Math.random()*8+1)];
    this.targetPosition = 0;
    this.targetDirection = 0;
    gsap.to(this.anim, 
      {
        rotation: crazySpin, duration: 1 
      });
      gsap.to(this.anim, 
        {
          rotation: 0, duration: 1
        }); 

    console.log("starting numbers are: " + this.startingNumbers);
    console.log("starting dir is: " + this.currentDirection);
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
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

  private setDirection(value: number)
  {
    this.targetPosition += value;
    this.targetDirection = value;
    this.currentRotation += value;
  }

  private MakeGuess()
  {
    if(Math.abs(this.targetPosition) != this.startingNumbers[this.gameState]) 
      {
        this.resetGame();
        console.log("GameOver due to Wrong Guess")
        return;
      }
    
    if(this.gameState == gameNumbers-1)
      {
        //Game Over -> VICTORY
        console.log("GameOver due to VICTORY")
        return;
      }
    console.log("Good Guess")
    this.gameState += 1;
    this.targetPosition = 0;
    this.currentDirection *= -1;
    this.targetDirection = this.currentDirection;
    console.log("Gamestate is now: " + this.gameState);
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
  
  
  private updateAnimation()
  {
    //if(this.targetPosition == 0) return;
    
    console.log("Rot" + this.anim.rotation);
    console.log("Length" + this.targetPosition);

    //this.anim.rotation += 1;
    
    //let rotateMe:boolean = true;

    gsap.to(this.anim, 
    {
      rotation: (/*this.anim.rotation*/ (this.currentRotation * sixtyDegree))
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
  /*
  onActionRelease(action: keyof typeof Keyboard.actions) {
    if (
      (action === "LEFT" && this.state.velocity.x < 0) ||
      (action === "RIGHT" && this.state.velocity.x > 0)
    ) {
      this.stopMovement();
    }
  }
  */
  /*
  get jumping() {
    return this.state.jumping;
  }

  private set jumping(value: boolean) {
    this.state.jumping = value;
    this.updateAnimState();
  }

  private set dashing(value: boolean) {
    this.state.dashing = value;
    this.updateAnimState();
  }

  get dashing() {
    return this.state.dashing;
  }
  
  private updateAnimState() {
    const { walk, jump, dash, idle } = Player.animStates;

    if (this.dashing) {
      if (this.currentState === dash) return;

      this.setState(dash);
    } else if (this.jumping) {
      if (this.currentState === jump || this.currentState === dash) return;

      this.setState(jump);
    } else if (this.state.velocity.x !== 0) {
      if (this.currentState === walk) return;

      this.setState(walk);
    } else {
      if (this.currentState === idle) return;

      this.setState(idle);
    }
  }

  stopMovement() {
    this.decelerationTween?.progress(1);

    this.decelerationTween = gsap.to(this.state.velocity, {
      duration: this.config.decelerateDuration,
      x: 0,
      ease: "power1.in",
      onComplete: () => {
        this.updateAnimState();
      },
    });
  }

  async move(direction: Directions) {
    if (this.dashing) return;

    this.decelerationTween?.progress(1);

    this.state.velocity.x = direction * this.config.speed;

    this.updateAnimState();

    gsap.to(this.scale, {
      duration: this.config.turnDuration,
      x: this.config.scale * direction,
    });
  }

  async dash() {
    if (this.state.velocity.x === 0) return;

    this.dashing = true;

    this.decelerationTween?.progress(1);

    this.state.velocity.x =
      this.config.speed *
      this.config.dash.speedMultiplier *
      this.getDirection();

    await wait(this.config.dash.duration);

    this.state.velocity.x = this.config.speed * this.getDirection();

    this.dashing = false;
  }

  private getDirection() {
    if (this.state.velocity.x === 0)
      return this.scale.x > 0 ? Directions.RIGHT : Directions.LEFT;

    return this.state.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;
  }

  async jump() {
    if (this.jumping) return;

    const { height, duration, ease } = this.config.jump;

    this.jumping = true;

    await gsap.to(this, {
      duration,
      y: `-=${height}`,
      ease: `${ease}.out`,
      yoyo: true,
      yoyoEase: `${ease}.in`,
      repeat: 1,
    });

    this.jumping = false;
  }
  */
}
