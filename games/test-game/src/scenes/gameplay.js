export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    }

    create() {

        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "gameplay scene")
            .setScale(4)
            .setTint(0x1a1c2c)
            .setOrigin(0.5);
    }
}