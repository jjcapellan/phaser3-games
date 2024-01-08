export default class Bullet extends Phaser.Physics.Arcade.Image {

    constructor(shooter, frame, speed, scene) {
        super(scene, -1000, -1000, "atlas", frame);

        this.shooter = shooter;

        // Physics
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.speed = speed;

    }

    preUpdate(time, delta) {
        //super.preUpdate(time, delta);
        if (this.y > this.scene.scale.height || this.y < 0) {
            this.body.reset(-1000, -1000);
        }
    }

    shoot() {
        if (this.body.velocity.y) return;
        this.body.reset(this.shooter.x, this.shooter.y);
        this.setVelocityY(this.speed);
    }

} // End class Bullet