import 'phaser';
import { ObjectPool } from "./utils";
import { default as GameState } from "./gameState";
declare class PlayGameState extends GameState {
    background: Phaser.TileSprite;
    role: Phaser.Sprite;
    enemyCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    enemyBulletCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    roleCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    roleBulletCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    roleBulletPool: ObjectPool;
    effect: Phaser.Sprite;
    concernedKeys: any;
    timer: Phaser.Timer;
    createRole(): void;
    createEnemy(x: number, y: number): Phaser.Sprite;
    preload(): void;
    create(): void;
    setKeyboard(): void;
    update(): void;
    moveRole(): void;
}
export default PlayGameState;
