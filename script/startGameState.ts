import {default as GameState} from "./gameState";

export default class StartGameState extends GameState
{
	preload()
	{
		this.game.load.baseURL = "res/";
		this.game.load.image('start-1', "background/start-1.png");
		this.game.load.image('start-2', "background/start-2.png");
		this.game.load.spritesheet('loading-text', "background/loading-text.png", 256, 64, 2);
		this.game.load.atlasJSONArray('loading-moon', "background/moon.png", "background/moon.json");
	};

	create()
	{
		super.create();
		this.game.world.alpha = 0;
		this.game.add.tween(this.game.world).to({alpha: 1}, 2000, Phaser.Easing.Default, true);

		let image1 = this.game.add.image(0, 0, 'start-1');
		let image2 = this.game.add.image(1024, 0, 'start-2');

		let timer = this.game.time.create(false);
		timer.start();
		timer.loop(500, () =>
		{
			let moon = this.game.add.image(1000 + (Math.random() - 0.5) * 400, 600 + Math.random() * 100, 'loading-moon');
			moon.scale = new Phaser.Point(0.8, 0.8);
			moon.alpha = 0;
			this.game.add.tween(moon).to({alpha: 0.5}, 1000, Phaser.Easing.Default, true);
			moon.animations.add('rotate', null, 60, true);
			moon.animations.play('rotate');
			moon.frame = Math.round(Math.random() * 240);
			let down = this.game.add.tween(moon).to({y: Math.random() * 100 + 850}, 4000, Phaser.Easing.Default, true);
			timer.add(3000, () =>
			{
				this.game.add.tween(moon).to({alpha: 0}, 1000, Phaser.Easing.Default, true).onComplete.add(() =>
				{
					down.manager.remove(down);
					moon.destroy();
				})
			});
		});


		let loadingText1 = this.game.add.image(900, 770, 'loading-text', 1);
		loadingText1.alpha = 0.3;
		this.game.add.tween(loadingText1).to({alpha: 0.7}, 300, Phaser.Easing.Default, true, 0, -1, true);

		let loadingText2 = this.game.add.image(850, 740, 'loading-text', 0);
		loadingText2.alpha = 0.3;
		this.game.add.tween(loadingText2).to({alpha: 0.7}, 300, Phaser.Easing.Default, true, 500, -1, true);


		let concernedKeys = this.game.input.keyboard.addKeys({
			"z": Phaser.KeyCode.Z
		});
		this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.Z);
		concernedKeys.z.onDown.addOnce(() =>
		{
			this.game.add.tween(this.game.world).to({alpha: 0}, 500, Phaser.Easing.Default, true).onComplete.add(() =>
			{
				this.game.state.start('menu', true, false);
			})
		});
	};

	update()
	{

	};
}