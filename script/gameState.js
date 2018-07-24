import 'phaser';
class GameState extends Phaser.State {
    constructor() {
        super();
        this.showFPS = true;
    }
    create() {
        this.game.time.advancedTiming = true;
        this.fps = this.game.add.text(0, 0, "", { fill: "#ff0000", fontSize: 30 });
        this.fps.fixedToCamera = true;
    }
    render() {
        this.fps.text = "Fps:" + this.game.time.fps;
        this.fps.bringToTop();
    }
    ;
}
export default GameState;
//# sourceMappingURL=gameState.js.map