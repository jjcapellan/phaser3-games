export default class Load extends Phaser.Scene {

    constructor() {

        super("load");

    }

    preload() {

        this.text_loading = this.add.text(CENTER.x, CENTER.y, "Loading ...", { fontSize: 32, color: COLORS.foreground });

        this.load.on("complete", function () {
            this.createFont();
            this.scene.start("menu");
        }, this);

        this.load.image("font7x10", "/assets/imgs/font7x10.png");

        this.load.on("progress", this.updateText, this);

    } // End preload()

    createFont() {

        const config = {
            image: "font7x10",
            width: 7,
            height: 10,
            chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-* ",
            charsPerRow: 10,
            offset: { x: 0, y: 0 },
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add("pixelfont", Phaser.GameObjects.RetroFont.Parse(this, config));

    } // End createFont()

    updateText(progress) {

        this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;

    } // End updateText
}