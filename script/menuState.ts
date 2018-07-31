import {default as GameState} from "./gameState";

export default class MenuState extends GameState
{
	get index(): number
	{
		return this._index || 0;
	}

	set index(value: number)
	{
		value = (value + this.menuText.length) % this.menuText.length;
		(this.menuItems.getAt(this.index) as Phaser.Image).frameName = this.menuText[this.index] + "-2.png";
		this._index = value;
		(this.menuItems.getAt(this.index) as Phaser.Image).frameName = this.menuText[this.index] + ".png";
		this.game.add.tween((this.menuItems.getAt(this.index) as Phaser.Image)).to({
			x: (this.menuItems.getAt(this.index) as Phaser.Image).x + 3,
			y: (this.menuItems.getAt(this.index) as Phaser.Image).y + 3
		}, 20, Phaser.Easing.Default, true, 0, 1, true);
	}

	private menuText: Array<string>;
	private menuItems: Phaser.Group;
	private _index: number;

	preload()
	{
		this.game.load.baseURL = "res/texture/title/";
		this.game.load.image('background1', "title_bk00.png");
		this.game.load.image('background2', "title_bk00(1).png");
		this.game.load.image('title_ch00');
		this.game.load.image('title_logo');
		this.game.load.image('title_logob');
		this.game.load.atlasJSONArray('title_text');
	}

	create()
	{
		super.create();
		this.game.add.tween(this.game.world).to({alpha: 1}, 3000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(() =>
		{
		});
		this.game.add.image(0, 0, 'background1');
		this.game.add.image(1024, 0, 'background2');

		let logo2 = this.game.add.image(500, this.game.height / 2 - 25, 'title_logob');
		logo2.anchor = new Phaser.Point(0.5, 0.5);
		this.game.add.tween(logo2).to({x: 850, angle: 360}, 1500, Phaser.Easing.Default, true);

		let logo1 = this.game.add.image(500, this.game.height / 2 - 25, 'title_logo');
		logo1.anchor = new Phaser.Point(0.5, 0.5);
		this.game.add.tween(logo1).to({x: 960, angle: 360}, 1500, Phaser.Easing.Default, true);

		let rm = this.game.add.image(-400, 480, 'title_ch00');
		rm.anchor = new Phaser.Point(0.5, 0.5);
		this.game.add.tween(rm).to({x: 400}, 1500, Phaser.Easing.Default, true);

		this.menuText = ["game start", "ex start", "practice", "replay", "play data", "music room", "option", "manual", "quit"];
		this.menuItems = new Phaser.Group(this.game);
		for (let i = 0; i < this.menuText.length; i++)
		{
			this.menuItems.add(this.game.add.image(110 - Math.sin(i * Math.PI / 7 - Math.PI * 0.1) * 70, 460 + i * 50, "title_text", this.menuText[i] + "-2.png"));
		}
		this.index = 0;


		let keyUp = this.game.input.keyboard.addKey(Phaser.KeyCode.UP);
		let keyDown = this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
		let timer = this.game.time.create(false);
		timer.start();
		let keyUpTimer;
		keyUp.onDown.add(() =>
		{
			this.index--;
			keyUpTimer = timer.loop(200, () =>
			{
				this.index--;
			});
		});
		keyUp.onUp.add(() =>
		{
			timer.remove(keyUpTimer);
		});
		let keyDownTimer;
		keyDown.onDown.add(() =>
		{
			this.index++;
			keyDownTimer = timer.loop(200, () =>
			{
				this.index++;
			});
		});
		keyDown.onUp.add(() =>
		{
			timer.remove(keyDownTimer);
		});

	}


	update()
	{

	}

}