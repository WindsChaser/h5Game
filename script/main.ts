/**
 * 主模块
 */
import 'pixi';
import 'p2';
import 'phaser'
import startGameState from './startGameState.js'
import playGameState from './playGameState.js'


/**
 * 新建游戏
 * @type {Phaser.Game}
 */
let game = new Phaser.Game(1280, 960, Phaser.AUTO);
game.state.add("start", new startGameState());//游戏启动画面
game.state.add("play", new playGameState());//正式开始游戏画面
game.state.start("start");
