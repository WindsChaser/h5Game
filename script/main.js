import 'pixi';
import 'p2';
import 'phaser';
import startGameState from './startGameState.js';
import playGameState from './playGameState.js';
import menuState from './menuState.js';
let game = new Phaser.Game(1280, 960, Phaser.AUTO);
game.state.add("start", new startGameState());
game.state.add("menu", new menuState());
game.state.add("play", new playGameState());
game.state.start("start");
//# sourceMappingURL=main.js.map