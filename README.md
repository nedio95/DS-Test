# DS-Test

## Code interview for a Simple 2D Game using PixiJS & GSAP using a provided framework

Input: Keyboard:
A, D - Turn vault wheel Left/Right
S - Lock in a wheel position

The player can turn a vault door wheel by pressing A or D on the keyboard.
A secret combination of three numbers has to be dialed sequentially.
If the first number is clockwise the second will always be counterclockwise, the third - clockwise and vice versa.
When the player turns the wheel in the worng direction it spins wildly and the game resets.
When the player reaches the correct wheel position, they can hear a sound queue
At any point the player can press S to lock in and start turning to the other direction.
When a player goes over a correct wheel position the game resets
When the player locks in all three numbers correctly, the door opens and the gold shines

## Usage 

1. Clone repository `npx degit https://github.com/nedio95/DS-Test new-folder`

2. Navigate to the new directory and install the project dependencies using `npm install`


### Commands

| Command           | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run start`   | Run dev server                                                       |
| `npm run build`   | Build project for production                                         |
| `npm run preview` | Preview production build (must run `build` before running `preview`) |

### Known Bugs

blink.png does not render if it is anywhere outside player.ts
Shine animation does not render at correct coordinates and does not randomize correctly

### Suggested Improvements
Vault door opening animation is a hack - make it a real animation
Move the game logic to Game.ts
Create a class for each type of game object 

