import 'phaser';
import { Vector, ObjectPool } from "./utils";
import { default as GameState } from "./gameState";
class PlayGameState extends GameState {
    createRole() {
        let scale = 2;
        this.role = this.game.add.sprite(this.game.width / 2, this.game.height - 100, "role");
        this.role.scale = new Phaser.Point(scale, scale);
        this.game.physics.p2.enable(this.role, true);
        this.role.body.setCircle(3 * scale);
        this.role.body.mass = 16;
        this.role.body.motionState = Phaser.Physics.P2.Body.DYNAMIC;
        this.role.body.fixedRotation = true;
        this.role.body.setCollisionGroup(this.roleCollisionGroup);
        this.role.body.collides([this.enemyBulletCollisionGroup]);
        this.role.body.collideWorldBounds = true;
        this.role.body.onBeginContact.add(() => {
        }, this);
        this.game.camera.follow(this.role);
        this.effect = this.role.addChild(this.game.make.sprite(0, 0, "sloweffect"));
        this.effect.anchor = new Phaser.Point(0.5, 0.5);
        this.game.add.tween(this.effect).to({ angle: 360 }, 4000, Phaser.Easing.Default, true, 0, -1);
        this.effect["fadeOut"] = this.game.add.tween(this.effect).to({ alpha: 0 }, 100, Phaser.Easing.Default, false, 0);
        this.effect["fadeOut"].onComplete.add(() => this.effect.alpha = 0);
        this.effect["fadeIn"] = this.game.add.tween(this.effect).to({ alpha: 1 }, 100, Phaser.Easing.Default, false, 0);
        this.effect["fadeIn"].onComplete.add(() => this.effect.alpha = 1);
        this.role.animations.add("stand", [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
        this.role.animations.add("left", [11, 12, 13, 14, 15], 16, true);
        this.role.animations.add("beginLeft", [8, 9, 10], 16, false).onComplete.add(() => {
            this.role.animations.play("left");
        }, this);
        this.role.animations.add("right", [19, 20, 21, 22, 23], 16, true);
        this.role.animations.add("beginRight", [16, 17, 18], 16, false).onComplete.add(() => {
            this.role.animations.play("right");
        }, this);
    }
    createEnemy(x, y) {
        let enemy = this.game.add.sprite(x || 200, y || 200, 'enemy');
        enemy.animations.add('stand', [0, 1, 2, 3, 4], 10, true);
        enemy.animations.play('stand');
        this.game.physics.p2.enable(enemy, false);
        enemy.body.static = true;
        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides([this.roleBulletCollisionGroup]);
        enemy.body.collideWorldBounds = true;
        enemy.health = 10;
        let fire = this.timer.loop(100, () => {
            let bullet = this.game.add.sprite(enemy.body.x, enemy.body.y, 'bullet-enemy', 162);
            this.game.physics.p2.enable(bullet, false);
            bullet.body.setCircle(8);
            bullet.body.setZeroDamping();
            let tween = this.game.add.tween(bullet.body).to({ angle: 359 }, 4000, Phaser.Easing.Default, true, 0, -1);
            bullet.body.setCollisionGroup(this.enemyBulletCollisionGroup);
            bullet.body.collides([this.roleCollisionGroup]);
            bullet.body.collideWorldBounds = false;
            bullet.body.onBeginContact.add(() => {
                bullet.kill();
                this.game.camera.shake(0.01, 500, true);
            }, this);
            bullet.checkWorldBounds = true;
            bullet.events.onOutOfBounds.add(() => {
                bullet.kill();
            }, this);
            bullet.events.onKilled.add(() => {
                this.game.tweens.remove(tween);
                bullet.destroy();
            });
            let vector = new Vector(this.role.body.x - bullet.body.x, this.role.body.y - bullet.body.y);
            vector.value = 400;
            bullet.body.velocity.x = vector.x;
            bullet.body.velocity.y = vector.y;
        });
        enemy.body.onBeginContact.add(() => {
            enemy.damage(1);
        });
        enemy.events.onKilled.add(() => {
            this.timer.remove(fire);
            enemy.destroy();
        });
        return enemy;
    }
    preload() {
        this.game.load.baseURL = "res/";
        this.game.load.spritesheet("role", 'texture/role/role_01.png', 32, 48);
        this.game.load.spritesheet("sloweffect", 'texture/sloweffect.png', 64, 64);
        this.game.load.spritesheet("enemy", 'texture/enemy.png', 64, 64);
        this.game.load.spritesheet('bullet-enemy', 'texture/bullet.png', 16, 16);
        this.game.load.image('bullet-role', 'texture/role/role_05.png');
        this.game.load.image("st01a", "texture/st01a.png");
        this.game.load.audio('bgm', 'sound/bgm.mp3');
    }
    ;
    create() {
        super.create();
        this.game.add.tween(this.game.world).to({ alpha: 1 }, 1000, Phaser.Easing.Default, true);
        this.game.stage.backgroundColor = 0x000000;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 1;
        this.roleCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.roleBulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyBulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.game.physics.p2.updateBoundsCollisionGroup(true);
        this.timer = this.game.time.create(false);
        this.timer.start();
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "st01a");
        this.background.autoScroll(0, 90);
        this.createRole();
        this.setKeyboard();
        this.roleBulletPool = new ObjectPool(() => {
            let bullet = this.game.add.sprite(0, 0, "bullet-role");
            this.game.physics.p2.enable(bullet, false);
            bullet.body.setZeroDamping();
            bullet.body.setCollisionGroup(this.roleBulletCollisionGroup);
            bullet.body.collides([this.enemyCollisionGroup]);
            bullet.body.collideWorldBounds = false;
            bullet.body.onBeginContact.add(() => {
                bullet.kill();
                bullet.release();
            }, this);
            bullet.checkWorldBounds = true;
            bullet.events.onOutOfBounds.add((bullet) => {
                bullet.kill();
                bullet.release();
            });
            return bullet;
        }, (bullet) => {
        }, (bullet, x, y, vx, vy) => {
            bullet.reset(0, 0);
            bullet.body.angle = -90;
            bullet.body.x = x;
            bullet.body.y = y;
            bullet.body.velocity.x = vx;
            bullet.body.velocity.y = vy;
        });
        this.timer.repeat(0, 20, () => {
            this.createEnemy(Math.random() * 800, Math.random() * 400);
        });
        this.timer.loop(1000, () => {
        }, this);
        let fireEvent;
        this.concernedKeys.z.onDown.add(() => {
            let bullet = this.roleBulletPool.get(this.role.x, this.role.y, 0, -1200);
            fireEvent = this.timer.loop(1000 / 20, () => {
                let bullet = this.roleBulletPool.get(this.role.x, this.role.y, 0, -1200);
            });
        });
        this.concernedKeys.z.onUp.add(() => {
            this.timer.remove(fireEvent);
        });
        let bgm = this.game.add.audio('bgm');
        bgm.onDecoded.add((bgm) => {
            bgm.play();
        });
    }
    ;
    setKeyboard() {
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
    update() {
        this.moveRole();
    }
    ;
    moveRole() {
        if (this.concernedKeys.left.justDown)
            this.role.animations.play("beginLeft");
        else if (this.concernedKeys.right.justDown)
            this.role.animations.play("beginRight");
        else if (!this.concernedKeys.left.isDown && !this.concernedKeys.right.isDown)
            this.role.animations.play("stand");
        if (this.concernedKeys.shift.justDown)
            this.effect["fadeIn"].start();
        else if (this.concernedKeys.shift.justUp)
            this.effect["fadeOut"].start();
        else if (this.concernedKeys.shift.isDown)
            this.effect.alpha = 1;
        else
            this.effect.alpha = 0;
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
//# sourceMappingURL=playGameState.js.map