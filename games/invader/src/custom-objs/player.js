const PLAYER_SPEED = 120;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "atlas", "Player-0");  

        // Texture animation
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
        this.play("player_idle");

        // Physics
        this.scene.physics.add.existing(this);
        this.enableBody();
        this.setDragX(PLAYER_SPEED * 1.8);

        // Controls
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.leftKey.isDown){
            this.setVelocityX(-PLAYER_SPEED);
        }
        if(this.rightKey.isDown){
            this.setVelocityX(PLAYER_SPEED);
        }
    }

} // End class Player