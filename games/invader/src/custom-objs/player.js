export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "atlas", "Player-0");  

        // Texture animation
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
        this.play("player_idle");

        // Physics configured only to allow collisions
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.setDirectControl();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

} // End class Player