//import config from "../config";
//import ParallaxBackground from "../prefabs/ParallaxBackground"; //We're not doing a paralax background. (for now)
import { Player } from "../prefabs/Player";
import Scene from "../core/Scene";
//import SpineAnimation from "../core/SpineAnimation"; // We're not doing a spine anim (for now)
import { Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";

export default class Game extends Scene {
  name = "Game";

  private player!: Player;
  private background!: Sprite;

  load() {
    this.background = Sprite.from("bg"); // We don't need a paralax background for this project design -  
    //Feature idea: The player is able to look around the whole treasure room, maybe there are some hidden clues.
    this.player = new Player();

    this.rescaleBackground(window.innerWidth, window.innerHeight);
    this.placePlayer();

    //this.background.initPlayerMovement(this.player);

    this.addChild(this.background, this.player);
  }
  /* No spine animations for this project scope
  async start() {
    // Example of how to play a spine animation
    const vine = new SpineAnimation("vine-pro");

    vine.stateData.setMix("grow", "grow", 0.5);

    vine.x = 0;
    vine.y = window.innerHeight / 2 - 50;

    this.background.addChild(vine);

    while (vine) {
      await vine.play("grow");
    }
  }
  */
  onResize(width: number, height: number) {
    if (this.background) this.rescaleBackground(width, height)
    
    if (this.player) this.placePlayer();
  }

  placePlayer()
  {
    if (this.player) 
    {
      this.player.scale = this.background.scale;
      centerObjects(this.player);
    }
  }

  rescaleBackground(width: number, height: number) 
  {
    if (this.background) 
    {
      this.background.width = width;
      this.background.height = height;
      centerObjects(this.background);
    }
  }

}
