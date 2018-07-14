var KeyCode = Phaser.KeyCode;
function getState(game) {
    let preload = () => {
        game.load.baseURL = "res/";
        game.load.image('start-1', "background/start-1.png");
        game.load.image('start-2', "background/start-2.png");
        game.load.spritesheet('loading-text', "background/loading-text.png", 256, 64, 2);
        game.load.atlasJSONArray('loading-moon', "background/moon.png", "background/moon.json");
    };
    let create = () => {
        game.world.alpha = 0;
        game.add.tween(game.world).to({ alpha: 1 }, 2000, Phaser.Easing.Default, true);
        let image1 = game.add.image(0, 0, 'start-1');
        let image2 = game.add.image(1024, 0, 'start-2');
        let timer = game.time.create(false);
        timer.start();
        timer.loop(500, () => {
            let moon = game.add.image(1000 + (Math.random() - 0.5) * 400, 600 + Math.random() * 100, 'loading-moon');
            moon.scale = new Phaser.Point(0.8, 0.8);
            moon.alpha = 0;
            game.add.tween(moon).to({ alpha: 0.5 }, 1000, Phaser.Easing.Default, true);
            moon.animations.add('rotate', null, 60, true);
            moon.animations.play('rotate');
            moon.frame = Math.round(Math.random() * 240);
            let down = game.add.tween(moon).to({ y: Math.random() * 100 + 850 }, 4000, Phaser.Easing.Default, true);
            timer.add(3000, () => {
                game.add.tween(moon).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true).onComplete.add(() => {
                    down.manager.remove(down);
                    moon.destroy();
                });
            });
        });
        let loadingText1 = game.add.image(900, 770, 'loading-text', 1);
        loadingText1.alpha = 0.3;
        game.add.tween(loadingText1).to({ alpha: 0.7 }, 300, Phaser.Easing.Default, true, 0, -1, true);
        let loadingText2 = game.add.image(850, 740, 'loading-text', 0);
        loadingText2.alpha = 0.3;
        game.add.tween(loadingText2).to({ alpha: 0.7 }, 300, Phaser.Easing.Default, true, 500, -1, true);
        let concernedKeys = game.input.keyboard.addKeys({
            "z": KeyCode.Z
        });
        game.input.keyboard.addKeyCapture(KeyCode.Z);
        concernedKeys.z.onDown.addOnce(() => {
            game.add.tween(game.world).to({ alpha: 0 }, 500, Phaser.Easing.Default, true).onComplete.add(() => {
                game.state.start('play', true, true);
            });
        });
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