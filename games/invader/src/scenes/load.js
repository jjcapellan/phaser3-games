export default class Load extends Phaser.Scene {

    constructor() {

        super("load");

    }

    preload() {

        this.text_loading = this.add.text(CENTER.x, CENTER.y, "Loading ...", { fontSize: 32, color: COLORS.foreground })
            .setOrigin(0.5);

        this.load.on("complete", function () {
            this.createFont();
            this.createAnimations();
            this.scene.start("menu");
        }, this);

        this.load.atlas("atlas", "imgs/invader.png", "imgs/invader.json");
        this.load.audio("menu-background", "sounds/loop_space_ambience_128.mp3");
        this.load.audio("player_shoot", "sounds/laser1.ogg");
        this.load.audio("enemy_shoot", "sounds/laser2.ogg");
        this.load.audio("explode", "sounds/expl_22050.ogg");
        this.load.audio("ground", "sounds/ground.ogg");
        this.load.audio("shield_hit1", "sounds/metal_crash1_22050.ogg");
        this.load.audio("shield_hit2", "sounds/metal_crash2_22050.ogg");
        this.load.audio("shield_hit3", "sounds/metal_crash3_22050.ogg");
        this.load.audio("gameover", "sounds/gameover1.ogg");
        this.load.audio("gamewin", "sounds/win.ogg");
        this.load.audio("ui_pluck", "sounds/ui_pluck.ogg");

        this.load.on("progress", this.updateText, this);

    } // End preload()

    createFont() {

        const config = {
            image: "atlas",
            width: 7,
            height: 10,
            chars: "0123456789abcdefghijklmnopqrstuvwxyz?!.,+-*%:= ",
            charsPerRow: 10,
            offset: { x: 0, y: 831 },
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add("pixelfont", Phaser.GameObjects.RetroFont.Parse(this, config));

    } // End createFont()

    createAnimations() {
        // Menu
        this.anims.create({ key: "enemy-falling", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy_spin-", end: 3 }), frameRate: 4, repeat: -1 });
        // Gameplay
        this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", end: 4 }), repeat: -1 });
        this.anims.create({ key: "enemy_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 5, end: 8 }) });
        this.anims.create({ key: "enemy_explode", frames: this.anims.generateFrameNames("atlas", { prefix: "Enemy-", start: 9, end: 14 }), frameRate: 5 });
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", end: 5 }), repeat: -1 });
        this.anims.create({ key: "player_shoot", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 6, end: 9 }) });
        this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNames("atlas", { prefix: "Player-", start: 10, end: 12 }), frameRate: 3 });
    }

    updateText(progress) {

        this.text_loading.text = `Loading ... ${Math.round(progress * 100)}%`;

    } // End updateText
}