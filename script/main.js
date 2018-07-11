/**
 * 主模块
 */
import startGameState from "./startGameState.js";
import playGameState from "./playGameState.js";
/**
 * 新建游戏
 * @type {Phaser.Game}
 */
let game = new Phaser.Game(1280, 960, Phaser.AUTO);
game.state.add("start", startGameState(game));
game.state.add("play", playGameState(game));
game.state.start("start");
//# sourceMappingURL=main.js.map