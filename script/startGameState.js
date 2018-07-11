function getState(game) {
    let preload = () => {
        game.load.baseURL = "res/";
        game.load.image('start-1', "background/start-1.png");
        game.load.image('start-2', "background/start-2.png");
        game.load.spritesheet('loading-text', "background/loading-text.png", 256, 64);
    };
    let create = () => {
        let image1 = game.add.image(0, 0, 'start-1');
        let image2 = game.add.image(1024, 0, 'start-2');
        let loadingText1 = game.add.image(900, 780, 'loading-text', 1);
        let loadingText2 = game.add.image(850, 740, 'loading-text', 0);
        image1.alpha = 0;
        image2.alpha = 0;
        loadingText1.alpha = 0.5;
        loadingText2.alpha = 0.5;
        game.add.tween(loadingText1).to({ alpha: 1 }, 300, Phaser.Easing.Default, true, 0, -1, true);
        game.add.tween(loadingText2).to({ alpha: 1 }, 300, Phaser.Easing.Default, true, 500, -1, true);
        game.add.tween(image1).to({ alpha: 1 }, 2000, Phaser.Easing.Default, true);
        game.add.tween(image2).to({ alpha: 1 }, 2000, Phaser.Easing.Default, true);
    };
    let update = () => {
        //console.log(loadingText.alpha);
    };
    let render = () => {
    };
    let gameState = { preload: preload, create: create, update: update, render: render };
    return gameState;
}
export default getState;
//# sourceMappingURL=startGameState.js.map