export default class Load extends Phaser.Scene {

    constructor() {

        super("load");

    }

    preload() {

        this.text_loading = this.add.text(CENTER.x, CENTER.y, "Loading ...", { fontSize: 32, color: COLORS.foreground })
            .setOrigin(0.5);

        this.load.on("complete", function () {
            this.createFont();
            this.scene.start("menu");
        }, this);

        this.load.atlas("atlas", "/assets/imgs/invader.png", "/assets/imgs/invader.json");
        this.load.audio("menu-background", "/assets/sounds/loop_space_ambience_128.mp3");
        this.load.audio("player_shoot", "/assets/sounds/laser1.ogg");
        this.load.audio("enemy_shoot", "/assets/sounds/laser2.ogg");
        this.load.audio("explode", "/assets/sounds/expl_22050.ogg");
        this.load.audio("ground", "/assets/sounds/expl2_22050.ogg");

        this.load.on("progress", this.updateText, this);

    } // End preload()

    createFont() {

        const config = {
            image: "atlas",
            width: 7,
            height: 10,
            chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-* ",
            charsPerRow: 10,
            offset: { x: 0, y: 831 },
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add("pixelfont", Phaser.GameObjects.RetroFont.Parse(this, config));

    } // End createFont()

    updateText(progress) {

        this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;

    } // End updateText
}