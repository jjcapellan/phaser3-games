import { genOscPositions } from "../utils.js";

const MOVE_RANGE = 14;
const FPS = 12;
const TIME_PER_FRAME = 1000 / FPS;
const Y_POSITIONS = genOscPositions(MOVE_RANGE);

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, offsetX, offsetY, anchor, bullets) {
        super(scene, 0, 0, "atlas", "Enemy-0");

        this.scene = scene;

        // This object position is relative to the anchor object
        this.anchor = anchor;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        // Motion animation
        this.countDown = TIME_PER_FRAME;
        this.yPosIdx = Phaser.Math.Between(0, Y_POSITIONS.length - 1);

        // Initial position
        this.x = offsetX + anchor.x;
        this.y = offsetY + Y_POSITIONS[this.yPosIdx] + anchor.y;

        // Texture animation
        this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", end: 4 }), repeat: -1 });
        this.anims.create({ key: "enemy_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 5, end: 8 }) });
        this.anims.create({ key: "enemy_explode", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 9, end: 14 }), frameRate: 5 });
        this.play("enemy_idle");

        // Physics configured only to allow collisions
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.setDirectControl();

        // Bullets pool
        this.bullets = bullets;
    }

    shoot() {
        this.chain(["enemy_shoot", "enemy_idle"]);
        this.stop();
        let b = this.bullets.getFirst();
        if (b) {
            this.shootSound.play();
            b.shoot(this.x, this.y);
        }
    }

    explode() {
        this.parentGroup.remove(this);
        this.setDirectControl(false);
        this.body.setGravityY(100);
        this.body.setAngularVelocity(Phaser.Math.Between(-30, 30));
        this.play("enemy_explode");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.body.gravity.y > 0) {
            if (this.y > this.scene.scale.height - 4) {
                
                this.body.setGravityY(0);
                this.body.reset(this.x, this.y);
                this.body.setEnable(false);
                this.active = false;
                this.emitter.emitParticle(10, this.x, this.y);
            }
            return;
        };
        this.countDown -= delta;
        if (this.countDown < 0) {
            this.countDown = TIME_PER_FRAME;
            this.yPosIdx = Phaser.Math.Wrap(++this.yPosIdx, 0, Y_POSITIONS.length);
            this.setY(this.offsetY + Y_POSITIONS[this.yPosIdx] + this.anchor.y);
        }
        this.setX(this.anchor.x + this.offsetX);
    }

} // End class Enemy