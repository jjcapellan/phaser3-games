export default class Bullet extends Phaser.Physics.Arcade.Image {

    constructor(frame, speed, scene) {
        super(scene, -1000, -1000, "atlas", frame);

        // Physics
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.speed = speed;

        // Necessary to use group.get()
        this.active = false;

        // Add this object to updateList and displayList. Not necessary if added using add.existing()
        this.addToUpdateList();
        this.addToUpdateList();

    }

    preUpdate(time, delta) {
        if (this.y > this.scene.scale.height || this.y < 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    shoot(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(this.speed);
    }

} // End class Bullet