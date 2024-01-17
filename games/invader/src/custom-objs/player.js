import Bullet from "./bullet.js";
import { SOUND_LEVELS } from "../utils.js";
const PLAYER_SPEED = 120;
const BULLET_SPEED = 250;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "atlas", "Player-0");

        this.isAlive = true;

        // Texture animation
        this.play("player_idle");

        // Physics
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.setCollideWorldBounds(true);

        // Bullet
        this.bullet = scene.add.existing(new Bullet("Bullet-0", -BULLET_SPEED, scene));

        // Controls
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (!this.isAlive) return;
        if (Phaser.Input.Keyboard.JustDown(this.shootKey) && !this.bullet.active) {
            this.chain(["player_shoot", "player_idle"]);
            this.stop();
            this.scene.sound.play("player_shoot", { volume: SOUND_LEVELS.shoot });
            this.bullet.shoot(this.x, this.y);
            this.scene.events.emit("player-shoot");
        }
        if (this.leftKey.isDown) {
            this.setVelocityX(-PLAYER_SPEED);
            return;
        }
        if (this.rightKey.isDown) {
            this.setVelocityX(PLAYER_SPEED);
            return;
        }
        this.setVelocityX(0);
    }

    explode() {
        this.setDirectControl(false);
        this.body.setGravityY(100);
        this.body.setAngularVelocity(Phaser.Math.Between(-30, 30));
        this.setCollideWorldBounds(true, 0, 0, true);
        this.play("player_hit");
        this.isAlive = false;
    }

} // End class Player