import 'phaser';
declare class GameState extends Phaser.State {
    private fps;
    showFPS: boolean;
    constructor();
    create(): void;
    render(): void;
}
export default GameState;
