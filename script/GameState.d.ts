declare class GameState {
    game: Phaser.Game;
    preload: Function;
    create: Function;
    update: Function;
    render: Function;
    constructor(game: Phaser.Game);
}
