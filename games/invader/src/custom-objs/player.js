import Bullet from "./bullet.js";
const PLAYER_SPEED = 120;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "atlas", "Player-0");

        // Texture animation
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
        this.anims.create({ key: "player_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 6, end: 9 }) });
        this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 10, end: 12 }), frameRate: 4 })
        this.play("player_idle");

        // Physics
        this.scene.physics.add.existing(this);
        this.enableBody();

        // Bullet
        this.bullet = scene.add.existing(new Bullet("Bullet-0", -200, scene));

        // Controls
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Shoot sound
        this.shootSound = this.scene.sound.add("laser1");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (Phaser.Input.Keyboard.JustDown(this.shootKey) && !this.bullet.active) {
            this.chain(["player_shoot", "player_idle"]);
            this.stop();
            this.shootSound.play();
            this.bullet.shoot(this.x, this.y);
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

} // End class Player