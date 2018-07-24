import 'phaser'
import {Vector, ObjectPool} from "./utils";
import {default as GameState} from "./gameState";

class PlayGameState extends GameState
{
	/**
	 * 游戏背景图
	 */
	background: Phaser.TileSprite;
	/**
	 * 主角
	 */
	role: Phaser.Sprite;
	/**
	 * 敌人碰撞组
	 */
	enemyCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	/**
	 * 敌人子弹碰撞组
	 */
	enemyBulletCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	/**
	 * 主角碰撞组
	 */
	roleCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	/**
	 * 子弹碰撞组
	 */
	roleBulletCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	/**
	 * 主角子弹对象池
	 */
	roleBulletPool: ObjectPool;
	/**
	 * 主角光环
	 */
	effect: Phaser.Sprite;
	/**
	 * 关注的按键
	 * @type Object
	 */
	concernedKeys;
	/**
	 * 游戏的定时器，可以管理多个定时任务
	 */
	timer: Phaser.Timer;

	/**
	 * 创建主角人物
	 */
	createRole()
	{
		let scale = 2;
		this.role = this.game.add.sprite(this.game.width / 2, this.game.height - 100, "role");//增加主角精灵
		this.role.scale = new Phaser.Point(scale, scale);//精灵大小放缩
		this.game.physics.p2.enable(this.role, true);//开启物理系统
		this.role.body.setCircle(3 * scale);
		this.role.body.mass = 16;//指定质量
		this.role.body.motionState = Phaser.Physics.P2.Body.DYNAMIC;//指定碰撞体类型
		this.role.body.fixedRotation = true;//固定旋转角度，也就是不旋转
		//role.body.data.shapes[0].sensor = true;//关闭碰撞，但是依旧有碰撞检测回调
		this.role.body.setCollisionGroup(this.roleCollisionGroup);//设置属于的碰撞组
		this.role.body.collides([this.enemyBulletCollisionGroup]);//设置要碰撞的组
		this.role.body.collideWorldBounds = true;
		this.role.body.onBeginContact.add(() =>
		{

		}, this);//设置碰撞回调，不需要开启impact

		this.game.camera.follow(this.role);//相机跟随


		/**
		 * 光环特效
		 * @type {Phaser.Sprite}
		 */
		this.effect = (this.role.addChild(this.game.make.sprite(0, 0, "sloweffect")) as Phaser.Sprite);//增加特效精灵作为主角精灵的孩子
		(this.effect as Phaser.Sprite).anchor = new Phaser.Point(0.5, 0.5);//设置锚点为正中以匹配主角精灵
		//effect.alpha = 0.8;//设置透明度
		this.game.add.tween(this.effect).to({angle: 360}, 4000, Phaser.Easing.Default, true, 0, -1);//增加旋转补间动画
		this.effect["fadeOut"] = this.game.add.tween(this.effect).to({alpha: 0}, 100, Phaser.Easing.Default, false, 0);//增加淡出动画
		this.effect["fadeOut"].onComplete.add(() => this.effect.alpha = 0);//淡出动画结束后设置透明度为0
		this.effect["fadeIn"] = this.game.add.tween(this.effect).to({alpha: 1}, 100, Phaser.Easing.Default, false, 0);//增加淡入动画
		this.effect["fadeIn"].onComplete.add(() => this.effect.alpha = 1);//动画结束后设置透明度为1
		/**
		 * 指定主角的站立、左移、右移动画
		 */
		this.role.animations.add("stand", [0, 1, 2, 3, 4, 5, 6, 7], 8, true);//增加站立动画帧序列
		this.role.animations.add("left", [11, 12, 13, 14, 15], 16, true);//左移动画
		this.role.animations.add("beginLeft", [8, 9, 10], 16, false).onComplete.add(() =>
		{
			this.role.animations.play("left");
		}, this);
		this.role.animations.add("right", [19, 20, 21, 22, 23], 16, true);
		this.role.animations.add("beginRight", [16, 17, 18], 16, false).onComplete.add(() =>
		{
			this.role.animations.play("right");
		}, this);
	}

	/**
	 * 创建敌人
	 * @param {number} x
	 * @param {number} y
	 * @return {Phaser.Sprite}
	 */
	createEnemy(x: number, y: number)
	{
		//let enemy = game.add.sprite(x || 200, y || 200, 'enemy');
		let enemy = this.game.add.sprite(x || 200, y || 200, 'enemy');
		enemy.animations.add('stand', [0, 1, 2, 3, 4], 10, true);//开启帧动画
		enemy.animations.play('stand');
		this.game.physics.p2.enable(enemy, false);
		enemy.body.static = true;//设置不能移动
		enemy.body.setCollisionGroup(this.enemyCollisionGroup);
		enemy.body.collides([this.roleBulletCollisionGroup]);
		enemy.body.collideWorldBounds = true;
		enemy.health = 10;//生命值
		let fire = this.timer.loop(100, () =>
		{
			let bullet = this.game.add.sprite(enemy.body.x, enemy.body.y, 'bullet-enemy', 162);
			this.game.physics.p2.enable(bullet, false);
			bullet.body.setCircle(8);
			bullet.body.setZeroDamping();
			let tween = this.game.add.tween(bullet.body).to({angle: 359}, 4000, Phaser.Easing.Default, true, 0, -1);
			bullet.body.setCollisionGroup(this.enemyBulletCollisionGroup);
			bullet.body.collides([this.roleCollisionGroup]);
			bullet.body.collideWorldBounds = false;
			bullet.body.onBeginContact.add(() =>
			{
				bullet.kill();
				this.game.camera.shake(0.01, 500, true);
			}, this);
			bullet.checkWorldBounds = true;
			bullet.events.onOutOfBounds.add(() =>
			{
				bullet.kill();
			}, this);
			bullet.events.onKilled.add(() =>
			{
				this.game.tweens.remove(tween);
				bullet.destroy();
			});
			let vector = new Vector(this.role.body.x - bullet.body.x, this.role.body.y - bullet.body.y);
			vector.value = 400;
			bullet.body.velocity.x = vector.x;
			bullet.body.velocity.y = vector.y;
		});
		enemy.body.onBeginContact.add(() =>
		{
			enemy.damage(1);
		});
		enemy.events.onKilled.add(() =>
		{
			this.timer.remove(fire);
			enemy.destroy();
		});
		return enemy;
	}

	/**
	 * 游戏资源预加载
	 */
	preload()
	{
		this.game.load.baseURL = "res/";//设置基础URL
		this.game.load.spritesheet("role", 'texture/role/role_01.png', 32, 48);//主角贴图
		this.game.load.spritesheet("sloweffect", 'texture/sloweffect.png', 64, 64);//慢速移动特效贴图
		this.game.load.spritesheet("enemy", 'texture/enemy.png', 64, 64);//敌人贴图，大蝴蝶
		this.game.load.spritesheet('bullet-enemy', 'texture/bullet.png', 16, 16);//敌人子弹贴图集
		this.game.load.image('bullet-role', 'texture/role/role_05.png');//主角子弹贴图集
		this.game.load.image("st01a", "texture/st01a.png");//关卡背景贴图
		this.game.load.audio('bgm', 'sound/bgm.mp3');//BGM
	};

	/**
	 * 创建游戏起始对象和相关动画配置等
	 */
	create()
	{
		super.create();
		/**
		 * 游戏背景和物理引擎设置
		 * @type {number}
		 */
		this.game.add.tween(this.game.world).to({alpha: 1}, 1000, Phaser.Easing.Default, true);
		this.game.stage.backgroundColor = 0x000000;//设置游戏背景色
		this.game.physics.startSystem(Phaser.Physics.P2JS);//启动P2物理系统
		//game.physics.p2.gravity.y = 980;//物理系统增加全局重力
		this.game.physics.p2.restitution = 1;//设置碰撞能量吸收系数
		this.roleCollisionGroup = this.game.physics.p2.createCollisionGroup();//角色碰撞组
		this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();//敌人碰撞组
		this.roleBulletCollisionGroup = this.game.physics.p2.createCollisionGroup();//主角子弹碰撞组
		this.enemyBulletCollisionGroup = this.game.physics.p2.createCollisionGroup();//敌人子弹碰撞组
		this.game.physics.p2.updateBoundsCollisionGroup(true);//更新碰撞组
		//game.physics.p2.setImpactEvents(true);//开启物理事件回调
		this.timer = this.game.time.create(false);
		this.timer.start();//开启游戏全局定时器

		/**
		 * 创建循环贴图背景
		 * @type {Phaser.TileSprite}
		 */
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "st01a");
		this.background.autoScroll(0, 90);

		this.createRole();
		this.setKeyboard();

		this.roleBulletPool = new ObjectPool(() =>
		{
			let bullet = this.game.add.sprite(0, 0, "bullet-role");
			this.game.physics.p2.enable(bullet, false);
			bullet.body.setZeroDamping();
			bullet.body.setCollisionGroup(this.roleBulletCollisionGroup);
			bullet.body.collides([this.enemyCollisionGroup]);
			bullet.body.collideWorldBounds = false;
			bullet.body.onBeginContact.add(() =>
			{
				bullet.kill();
				bullet.release();//对象回收
			}, this);
			bullet.checkWorldBounds = true;
			bullet.events.onOutOfBounds.add((bullet) =>
			{
				bullet.kill();
				bullet.release();
			});
			return bullet;
		}, (bullet) =>
		{

		}, (bullet, x, y, vx, vy) =>
		{
			bullet.reset(0, 0);
			bullet.body.angle = -90;//调整贴图角度
			bullet.body.x = x;
			bullet.body.y = y;
			bullet.body.velocity.x = vx;
			bullet.body.velocity.y = vy;
		});


		this.timer.repeat(0, 20, () =>
		{
			this.createEnemy(Math.random() * 800, Math.random() * 400);
		});


		this.timer.loop(1000, () =>
		{
			//createBricks(10, 10, 20);
		}, this);
		let fireEvent: Phaser.TimerEvent;//发射子弹事件
		this.concernedKeys.z.onDown.add(() =>
		{
			let bullet = this.roleBulletPool.get(this.role.x, this.role.y, 0, -1200);//按下时必然发射一颗子弹
			fireEvent = this.timer.loop(1000 / 20, () =>
			{
				let bullet = this.roleBulletPool.get(this.role.x, this.role.y, 0, -1200);//从对象池中取出一个对象
			});
		});
		this.concernedKeys.z.onUp.add(() =>
		{
			this.timer.remove(fireEvent);//放开按键时停止发射
		});

		let bgm = this.game.add.audio('bgm');
		bgm.onDecoded.add((bgm) =>
		{
			bgm.play();
			//bgm.resume();//chrome66要求首次加载页面时必须调用resume方法，否则会拒绝播放
		});
	};

	/**
	 * 设置键盘输入监听
	 */
	setKeyboard()
	{
		{
			this.concernedKeys = this.game.input.keyboard.addKeys({
				"left": Phaser.KeyCode.LEFT,
				"right": Phaser.KeyCode.RIGHT,
				"up": Phaser.KeyCode.UP,
				"down": Phaser.KeyCode.DOWN,
				"shift": Phaser.KeyCode.SHIFT,
				"z": Phaser.KeyCode.Z,
				"space": Phaser.KeyCode.SPACEBAR
			});
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.LEFT);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.RIGHT);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.UP);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.DOWN);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.SHIFT);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.Z);
			this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
		}
	}

	/**
	 * 每一帧都会执行，处理玩家操作等
	 */
	update()
	{
		this.moveRole();
	};

	/**
	 * 每一帧中移动角色
	 */
	moveRole()
	{
		if (this.concernedKeys.left.justDown)
			this.role.animations.play("beginLeft");
		else if (this.concernedKeys.right.justDown)
			this.role.animations.play("beginRight");
		else if (!this.concernedKeys.left.isDown && !this.concernedKeys.right.isDown)
			this.role.animations.play("stand");

		if (this.concernedKeys.shift.justDown)
			(this.effect["fadeIn"] as Phaser.Tween).start();
		else if (this.concernedKeys.shift.justUp)
			(this.effect["fadeOut"] as Phaser.Tween).start();
		else if (this.concernedKeys.shift.isDown)
			this.effect.alpha = 1;
		else this.effect.alpha = 0;

		let speed = 500 * (this.concernedKeys.shift.isDown ? 0.4 : 1);
		let vector = new Vector(0, 0);
		if (this.concernedKeys.down.isDown)
			vector.y = 1;
		else if (this.concernedKeys.up.isDown)
			vector.y = -1;
		if (this.concernedKeys.right.isDown)
			vector.x = 1;
		else if (this.concernedKeys.left.isDown)
			vector.x = -1;
		vector.value = speed;
		this.role.body.velocity.x = vector.x;
		this.role.body.velocity.y = vector.y;
	}
}

export default PlayGameState;