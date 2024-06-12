//import gsap from "gsap";
import { Container, Sprite } from "pixi.js";

export class VaultDoor extends Container 
{   
    private vaultDoorSprite: Sprite;

    constructor() 
    {
      super();
  
      this.vaultDoorSprite = Sprite.from("door");
      this.vaultDoorSprite.anchor.set(0.5);
      this.addChild(this.vaultDoorSprite);
    }
}