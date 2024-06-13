import gsap from "gsap";
import { Container, Sprite } from "pixi.js";

const shineEffectZ = 2;
//const minDuration = 0;
//const maxDuration = 0;
//const offsetConstant = 0.1;

export class ShineEffect extends Container {

    private shineEffect: Sprite;
    
    constructor() 
    {  
        super();

        this.shineEffect = Sprite.from("blink");
        this.shineEffect.anchor.set(0.5);
        //this.shineEffect. = 0.1;
        //this.shineEffect.width = 0;  
        //this.shineEffect.height = 0;
        this.shineEffect.x = screen.width/2;
        this.shineEffect.y = screen.height/2;
        console.log("This effect has x: " + this.shineEffect.x + " and Y =: " + this.shineEffect.y);
        this.shineEffect.zIndex = shineEffectZ;
        
        gsap.to(this.shineEffect, 
            {
              x: this.shineEffect.x-50, y: this.shineEffect.y-50, rotation: 20, duration: 1
            }); 
        /*
        let animation = gsap.timeline({});
        animation.from(this.shineEffect, {alpha:0, width: 1, height: 1, stagger:1, duration:0.3})
            .to(this.shineEffect,{alpha: 1, width: 1, height: 1, duration: 0.3})
            //.to(this.shineEffect,{alpha:0, width: 0, height: 0, duration: 0.3});
        */
        console.log("A shine was created");
        

    }

    randomFuction()
    {
        let x = 0;
        let y = 2;
        x = x + y;
    }
}