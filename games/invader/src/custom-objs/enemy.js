import { genOscPositions } from "../utils.js";
const MOVE_RANGE = 14;
const FPS = 12;
const TIME_PER_FRAME = 1000 / FPS;
const Y_POSITIONS = genOscPositions(MOVE_RANGE);

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, offsetX, offsetY, anchor) {
        super(scene, 0, 0, "atlas", "Enemy-0");

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
        this.play("enemy_idle");

        // Physics configured only to allow collisions
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.setDirectControl();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.countDown -= delta;
        if (this.countDown < 0) {
            this.countDown = TIME_PER_FRAME;
            this.yPosIdx = Phaser.Math.Wrap(++this.yPosIdx, 0, Y_POSITIONS.length);
            this.setY(this.offsetY + Y_POSITIONS[this.yPosIdx] + this.anchor.y);
        }
    }

} // End class Enemy