import 'phaser';
import { Vector, ObjectPool } from "./utils";
function getState(game) {
    /**
     * 画笔
     */
    let graphics;
    /**
     * 显示在画面左上角的帧率
     */
    let fps;
    /**
     * 游戏背景图
     */
    let background;
    /**
     * 主角
     */
    let role;
    /**
     * 敌人碰撞组
     */
    let enemyCollisionGroup;
    /**
     * 敌人子弹碰撞组
     */
    let enemyBulletCollisionGroup;
    /**
     * 主角碰撞组
     */
    let roleCollisionGroup;
    /**
     * 子弹碰撞组
     */
    let roleBulletCollisionGroup;
    /**
     * 主角子弹对象池
     */
    let roleBulletPool;
    /**
     * 主角光环
     */
    let effect;
    /**
     * 关注的按键
     * @type Object
     */
    let concernedKeys;
    /**
     * 游戏的定时器，可以管理多个定时任务
     */
    let timer;
    let debug = 0;
    /**
     * 游戏资源预加载
     */
    let preload = () => {
        game.load.baseURL = "res/"; //设置基础URL
        game.load.spritesheet("role", 'texture/role/role_01.png', 32, 48); //主角贴图
        game.load.spritesheet("sloweffect", 'texture/sloweffect.png', 64, 64); //慢速移动特效贴图
        game.load.spritesheet("enemy", 'texture/enemy.png', 64, 64); //敌人贴图，大蝴蝶
        game.load.spritesheet('bullet-enemy', 'texture/bullet.png', 16, 16); //敌人子弹贴图集
        game.load.image('bullet-role', 'texture/role/role_05.png'); //主角子弹贴图集
        game.load.image("st01a", "texture/st01a.png"); //关卡背景贴图
        game.load.audio('bgm', 'sound/bgm.mp3'); //BGM
    };
    /**
     * 创建游戏起始对象和相关动画配置等
     */
    let create = () => {
        /**
         * 游戏背景和物理引擎设置
         * @type {number}
         */
        game.add.tween(game.world).to({ alpha: 1 }, 1000, Phaser.Easing.Default, true);
        game.stage.backgroundColor = 0x000000; //设置游戏背景色
        game.physics.startSystem(Phaser.Physics.P2JS); //启动P2物理系统
        //game.physics.p2.gravity.y = 980;//物理系统增加全局重力
        game.physics.p2.restitution = 1; //设置碰撞能量吸收系数
        roleCollisionGroup = game.physics.p2.createCollisionGroup(); //角色碰撞组
        enemyCollisionGroup = game.physics.p2.createCollisionGroup(); //敌人碰撞组
        roleBulletCollisionGroup = game.physics.p2.createCollisionGroup(); //主角子弹碰撞组
        enemyBulletCollisionGroup = game.physics.p2.createCollisionGroup(); //敌人子弹碰撞组
        game.physics.p2.updateBoundsCollisionGroup(true); //更新碰撞组
        //game.physics.p2.setImpactEvents(true);//开启物理事件回调
        timer = game.time.create(false);
        timer.start(); //开启游戏全局定时器
        /**
         * 创建循环贴图背景
         * @type {Phaser.TileSprite}
         */
        background = game.add.tileSprite(0, 0, game.width, game.height, "st01a");
        background.autoScroll(0, 90);
        /**
         * 创建一堆随机初速度的圆形和矩形
         * @param {number} xnumber 横向的物体个数
         * @param {number} ynumber 纵向的物体个数
         * @param {number} size 每个物体的包围盒大小
         */
        function createBricks(xnumber, ynumber, size) {
            for (let i = 0; i <= xnumber; i++) {
                for (let j = 0; j <= ynumber; j++) {
                    graphics = game.make.graphics(i * size, j * size); //增加画笔
                    graphics.beginFill(Phaser.Color.HSVColorWheel()[Phaser.Math.roundTo(Phaser.Math.random(1, 359))].color32); //设置画笔填充颜色
                    //graphics.beginFill(0x66ccff,1);
                    if (j % 2 == 1)
                        graphics.drawCircle(0, 0, size); //绘制圆形
                    else
                        graphics.drawRect(-size / 2, -size / 2, size, size); //绘制矩形
                    let brick = game.add.sprite(i * size, j * size, graphics.generateTexture());
                    game.physics.p2.enable(brick, false); //开启物理系统
                    if (j % 2 == 1)
                        brick.body.setCircle(size / 2); //设置碰撞体为圆，默认为矩形
                    brick.body.setZeroDamping(); //设置无阻力
                    brick.body.velocity.x = Math.random() * 50; //随机X速度
                    brick.body.velocity.y = Math.random() * 50; //随机Y速度
                    brick.body.setCollisionGroup(enemyCollisionGroup); //设置所属碰撞组
                    brick.body.collides([roleBulletCollisionGroup]); //设置要碰撞的组
                    brick.body.onBeginContact.add((thing) => {
                        //brick.body.removeNextStep = true;//确保body在下一个步进中才被摧毁
                        brick.destroy(); //建议使用闭包摧毁自身，不建议轻易访问回调参数中的其他对象
                    }, this); //设置碰撞回调
                    brick.body.collideWorldBounds = false; //不与世界边界碰撞
                    //graphics.body.data.shapes[0].sensor = true;//设置可穿透，只引发contact事件，不执行碰撞
                }
            }
        }
        //createBricks(20, 20, 20);
        function createRole() {
            let scale = 2;
            role = game.add.sprite(game.width / 2, game.height - 100, "role"); //增加主角精灵
            role.scale = new Phaser.Point(scale, scale); //精灵大小放缩
            game.physics.p2.enable(role, true); //开启物理系统
            role.body.setCircle(3 * scale);
            role.body.mass = 16; //指定质量
            role.body.motionState = Phaser.Physics.P2.Body.DYNAMIC; //指定碰撞体类型
            role.body.fixedRotation = true; //固定旋转角度，也就是不旋转
            //role.body.data.shapes[0].sensor = true;//关闭碰撞，但是依旧有碰撞检测回调
            role.body.setCollisionGroup(roleCollisionGroup); //设置属于的碰撞组
            role.body.collides([enemyBulletCollisionGroup]); //设置要碰撞的组
            role.body.collideWorldBounds = true;
            role.body.onBeginContact.add(() => {
            }, this); //设置碰撞回调，不需要开启impact
            game.camera.follow(role); //相机跟随
            /**
             * 光环特效
             * @type {Phaser.Sprite}
             */
            effect = role.addChild(game.make.sprite(0, 0, "sloweffect")); //增加特效精灵作为主角精灵的孩子
            effect.anchor = new Phaser.Point(0.5, 0.5); //设置锚点为正中以匹配主角精灵
            //effect.alpha = 0.8;//设置透明度
            game.add.tween(effect).to({ angle: 360 }, 4000, Phaser.Easing.Default, true, 0, -1); //增加旋转补间动画
            effect["fadeOut"] = game.add.tween(effect).to({ alpha: 0 }, 100, Phaser.Easing.Default, false, 0); //增加淡出动画
            effect["fadeOut"].onComplete.add(() => effect.alpha = 0); //淡出动画结束后设置透明度为0
            effect["fadeIn"] = game.add.tween(effect).to({ alpha: 1 }, 100, Phaser.Easing.Default, false, 0); //增加淡入动画
            effect["fadeIn"].onComplete.add(() => effect.alpha = 1); //动画结束后设置透明度为1
            /**
             * 指定主角的站立、左移、右移动画
             */
            role.animations.add("stand", [0, 1, 2, 3, 4, 5, 6, 7], 8, true); //增加站立动画帧序列
            role.animations.add("left", [11, 12, 13, 14, 15], 16, true); //左移动画
            role.animations.add("beginLeft", [8, 9, 10], 16, false).onComplete.add(() => {
                role.animations.play("left");
            }, this);
            role.animations.add("right", [19, 20, 21, 22, 23], 16, true);
            role.animations.add("beginRight", [16, 17, 18], 16, false).onComplete.add(() => {
                role.animations.play("right");
            }, this);
        }
        createRole();
        /**
         * 设置键盘输入
         */
        function setupKeyboard() {
            concernedKeys = game.input.keyboard.addKeys({
                "left": Phaser.KeyCode.LEFT,
                "right": Phaser.KeyCode.RIGHT,
                "up": Phaser.KeyCode.UP,
                "down": Phaser.KeyCode.DOWN,
                "shift": Phaser.KeyCode.SHIFT,
                "z": Phaser.KeyCode.Z,
                "space": Phaser.KeyCode.SPACEBAR
            });
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.LEFT);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.RIGHT);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.UP);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.DOWN);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.SHIFT);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.Z);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
        }
        roleBulletPool = new ObjectPool(() => {
            let bullet = game.add.sprite(0, 0, "bullet-role");
            game.physics.p2.enable(bullet, false);
            bullet.body.setZeroDamping();
            bullet.body.setCollisionGroup(roleBulletCollisionGroup);
            bullet.body.collides([enemyCollisionGroup]);
            bullet.body.collideWorldBounds = false;
            bullet.body.onBeginContact.add(() => {
                bullet.kill();
                bullet.release(); //对象回收
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
            bullet.body.angle = -90; //调整贴图角度
            bullet.body.x = x;
            bullet.body.y = y;
            bullet.body.velocity.x = vx;
            bullet.body.velocity.y = vy;
        });
        function createEnemy(x, y) {
            //let enemy = game.add.sprite(x || 200, y || 200, 'enemy');
            let enemy = game.add.sprite(x || 200, y || 200, 'enemy');
            enemy.animations.add('stand', [0, 1, 2, 3, 4], 10, true); //开启帧动画
            enemy.animations.play('stand');
            game.physics.p2.enable(enemy, false);
            enemy.body.static = true; //设置不能移动
            enemy.body.setCollisionGroup(enemyCollisionGroup);
            enemy.body.collides([roleBulletCollisionGroup]);
            enemy.body.collideWorldBounds = true;
            enemy.health = 10; //生命值
            let fire = timer.loop(100, () => {
                let bullet = game.add.sprite(enemy.body.x, enemy.body.y, 'bullet-enemy', 162);
                debug++;
                game.physics.p2.enable(bullet, false);
                bullet.body.setCircle(8);
                bullet.body.setZeroDamping();
                let tween = game.add.tween(bullet.body).to({ angle: 359 }, 4000, Phaser.Easing.Default, true, 0, -1);
                bullet.body.setCollisionGroup(enemyBulletCollisionGroup);
                bullet.body.collides([roleCollisionGroup]);
                bullet.body.collideWorldBounds = false;
                bullet.body.onBeginContact.add(() => {
                    bullet.kill();
                    game.camera.shake(0.01, 500, true);
                }, this);
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(() => {
                    bullet.kill();
                }, this);
                bullet.events.onKilled.add(() => {
                    game.tweens.remove(tween);
                    bullet.destroy();
                    debug--;
                });
                let vector = new Vector(role.body.x - bullet.body.x, role.body.y - bullet.body.y);
                vector.value = 400;
                bullet.body.velocity.x = vector.x;
                bullet.body.velocity.y = vector.y;
            });
            enemy.body.onBeginContact.add(() => {
                enemy.damage(1);
            });
            enemy.events.onKilled.add(() => {
                timer.remove(fire);
                enemy.destroy();
            });
            return enemy;
        }
        timer.repeat(0, 20, () => {
            createEnemy(Math.random() * 800, Math.random() * 400);
        });
        setupKeyboard();
        timer.loop(1000, () => {
            //createBricks(10, 10, 20);
        }, this);
        let fireEvent; //发射子弹事件
        concernedKeys.z.onDown.add(() => {
            let bullet = roleBulletPool.get(role.x, role.y, 0, -1200); //按下时必然发射一颗子弹
            fireEvent = timer.loop(1000 / 20, () => {
                let bullet = roleBulletPool.get(role.x, role.y, 0, -1200); //从对象池中取出一个对象
            });
        });
        concernedKeys.z.onUp.add(() => {
            timer.remove(fireEvent); //放开按键时停止发射
        });
        game.time.advancedTiming = true; //允许记录时间信息
        fps = game.add.text(0, 0, "", { fill: "#ff0000", fontSize: 30 }); //显示帧率
        fps.fixedToCamera = true; //固定显示在相机视野
        let bgm = game.add.audio('bgm');
        bgm.onDecoded.add((bgm) => {
            bgm.play();
            //bgm.resume();//chrome66要求首次加载页面时必须调用resume方法，否则会拒绝播放
        });
    };
    /**
     * 每一帧都会执行，处理玩家操作等
     */
    let update = () => {
        /**
         * 处理玩家移动
         */
        function moveRole() {
            if (concernedKeys.left.justDown)
                role.animations.play("beginLeft");
            else if (concernedKeys.right.justDown)
                role.animations.play("beginRight");
            else if (!concernedKeys.left.isDown && !concernedKeys.right.isDown)
                role.animations.play("stand");
            if (concernedKeys.shift.justDown)
                effect["fadeIn"].start();
            else if (concernedKeys.shift.justUp)
                effect["fadeOut"].start();
            else if (concernedKeys.shift.isDown)
                effect.alpha = 1;
            else
                effect.alpha = 0;
            let speed = 500 * (concernedKeys.shift.isDown ? 0.4 : 1);
            let vector = new Vector(0, 0);
            if (concernedKeys.down.isDown)
                vector.y = 1;
            else if (concernedKeys.up.isDown)
                vector.y = -1;
            if (concernedKeys.right.isDown)
                vector.x = 1;
            else if (concernedKeys.left.isDown)
                vector.x = -1;
            vector.value = speed;
            role.body.velocity.x = vector.x;
            role.body.velocity.y = vector.y;
        }
        moveRole();
        //console.log(roleBulletPool.size());
    };
    /**
     * 渲染结束后，更新帧率文字
     */
    let render = () => {
        fps.text = "Fps:" + game.time.fps;
        fps.bringToTop(); //置于最上层
        console.log(debug);
    };
    let playState = {
        preload: preload,
        create: create,
        update: update,
        render: render
    };
    return playState;
}
export default getState;
//# sourceMappingURL=playGameState.js.map