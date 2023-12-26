export default class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {

        // Texts
        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "menu scene")
            .setScale(4)
            .setTint(0x1a1c2c)
            .setOrigin(0.5);

        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40 * 2, "pixelfont", "click to play")
            .setTint(0x1a1c2c)
            .setOrigin(0.5);

        this.input.on("pointerdown", () => {
            this.scene.start("gameplay");
        });
    }
}