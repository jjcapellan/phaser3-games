import LayerFactory from "phaser3-scrollinglayer";
import TextMenu from "../custom-objs/txtmenu";
import { addPanel } from "../utils.js";

// Duration of camera fade effect in milliseconds
const FADE_DURATION = 1000;

// Delay of ship explosions in milliseconds
const EXPLOSION_DELAY = 1000 * 10;

//Colors
const TITLE_COLOR = 0x1a1c2c;
const MENU_COLOR = 0x566c86;
const MENU_HOVER_COLOR = 0xb13e53;
const MODAL_BK_COLOR = 0x000000;
const MODAL_SUBTITLE_COLOR = 0xffcd75;
const MODAL_TEXT_COLOR = 0xababab;

//Menu
const MENU_X = 640 / 2;
const MENU_Y = (360 / 2) / 3 + 40 * 3;

// Modal panel dimensions
const MODAL_WIDTH = 400;
const MODAL_HEIGHT = 290;

// Main font
const FONT = "pixelfont";

// Main texture
const TEXTURE = "atlas";

// Particle configs
const PART_EXPLOSION_CONF = {
    frame: "Particle-blue",
    lifespan: 8000,
    speed: { min: 2, max: 15 },
    scale: { max: 2, min: 0.5 },
    alpha: { start: 1, end: 0 },
    gravityY: 5,
    emitting: false,
    rotate: { max: 359, min: 0 }
};
const PART_SMOKE_CONF = {
    frame: "Smoke-0",
    lifespan: 3000,
    scale: { start: 0.5, end: 0 },
    alpha: { max: 0.8, min: 0.3 },
    speed: 6,
    angle: { min: -100, max: -84 },
    gravityY: -10,
};

export default class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        // Initial fadein effect
        this.cameras.main.fadeIn(FADE_DURATION);

        // Background sound
        this.snd_background = this.sound.add("menu-background", { loop: true });
        this.snd_background.play();

        // Background image (sky and sun)
        this.add.image(0, 0, TEXTURE, "Background-0")
            .setOrigin(0);

        // Ships
        this.ships = [];
        this.addShip(-50, -10, "Enemy_spin-0");
        this.addShip(-200, -300, "Enemy_spin-0");
        this.addShip(-500, -550, "Enemy_spin-0");

        // Explosion effect
        this.explode = this.add.particles(0, 0, TEXTURE, PART_EXPLOSION_CONF);

        // Image layer 3
        this.add.image(0, this.scale.height, TEXTURE, "Ruins3-0")
            .setOrigin(0, 1);

        // Image layer 2
        this.add.image(0, this.scale.height, TEXTURE, "Ruins2-0")
            .setOrigin(0, 1);

        // Smoke effect
        this.add.particles(49, this.scale.height - 20, TEXTURE, PART_SMOKE_CONF);

        // Fog effect
        this.add.existing(new LayerFactory(this, TEXTURE))
            .addHlayer(this.scale.height - 30, -10, "Fog-0")
            .setOverlap(0);

        // First plane image
        this.add.image(0, this.scale.height, TEXTURE, "Ruins1-0")
            .setOrigin(0, 1);

        // Title
        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, FONT, "invader")
            .setScale(8)
            .setTint(TITLE_COLOR)
            .setOrigin(0.5);

        // Menu
        this.menu = this.addMenu(MENU_X, MENU_Y);
        this.menu.setScale(2);

        // Modal dialog background
        this.panel = addPanel(this, CENTER.x, CENTER.y, MODAL_WIDTH, MODAL_HEIGHT, MODAL_BK_COLOR, 0.95)
            .setVisible(false);
        this.howToPlay = this.createHowToPlay().setOrigin(0.5).setPosition(CENTER.x, CENTER.y)
            .setVisible(false);

        // Events
        this.addEvents();

    }

    addEvents() {
        // One ship could explode every 10 seconds
        const explEvent = this.time.addEvent({ delay: EXPLOSION_DELAY, callback: this.explodeShip, callbackScope: this, loop: true });

        this.panel.on("pointerdown", this.hideHowToPlay, this);
        this.events.once("shutdown", () => {
            this.events.off("pointerdown");
            this.time.removeEvent(explEvent);
        });
    }

    addMenu(x, y) {
        return new TextMenu(this, x, y, FONT,
            [
                { name: "how to play", fn: this.showHowToPlay },
                { name: "play", fn: this.changeScene }
            ],
            {
                color: MENU_COLOR,
                hoverColor: MENU_HOVER_COLOR,
                padding: 8,
                hoverSound: "ui_pluck"
            });
    }

    changeScene() {
        this.closing = true;
        this.snd_background.stop();
        this.cameras.main.fadeOut(FADE_DURATION);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("gameplay"));
    }

    showHowToPlay() {
        this.panel.setVisible(true);
        this.howToPlay.setVisible(true);
    }

    hideHowToPlay() {
        this.panel.setVisible(false);
        this.howToPlay.setVisible(false);
    }

    addShip(x, y, texture) {
        let ship = this.add.sprite(x, y, TEXTURE, texture)
            .setScale(0.5)
            .setAngle(-45)
            .playAfterDelay("enemy-falling", Phaser.Math.Between(100, 1000));
        ship.speed = 0.1;

        this.ships.push(ship);
    }

    explodeShip() {
        const ship = this.ships.find(ship => ship.y > 180 && ship.visible);

        if (!ship) return;

        this.explode.setPosition(ship.x, ship.y);
        this.explode.emitParticle(40);
        ship.setVisible(false);
    }

    createHowToPlay() {
        const rt = this.add.renderTexture(0, 0, MODAL_WIDTH, MODAL_HEIGHT);
        let cx = rt.width / 2;

        let title = this.make.bitmapText({ font: FONT, text: "how to play", scale: 3 }, false)
            .setOrigin(0.5);
        rt.draw(title, cx, 30);

        let txt2 = this.make.bitmapText({
            font: FONT,
            text: "player          enemy"
        },
            false)
            .setOrigin(0.5);
        rt.draw(txt2, cx, 56);

        rt.drawFrame(TEXTURE, "Player-0", 132, 70);
        rt.drawFrame(TEXTURE, "Enemy-0", 246, 66);

        let txt3 = this.make.bitmapText({
            font: FONT,
            text: "objective",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(MODAL_SUBTITLE_COLOR);
        rt.draw(txt3, cx, 115);

        let txt4 = this.make.bitmapText({
            font: FONT,
            text: "destroy all enemies.",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(MODAL_TEXT_COLOR);
        rt.draw(txt4, cx, 130);

        let txt5 = this.make.bitmapText({
            font: FONT,
            text: "controls",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(MODAL_SUBTITLE_COLOR);
        rt.draw(txt5, cx, 155);

        let txt6 = this.make.bitmapText({
            font: FONT,
            text: "left  .......  a,left\n" +
                "right ....... d,right\n" +
                "shoot .......   space\n\n" +
                "or use gamepad",
            scale: 1,
        }, false)
            .setOrigin(0.5, 0)
            .setTint(MODAL_TEXT_COLOR);
        rt.draw(txt6, cx, 165);

        return rt;
    }

    addPanel(x, y, width, height, color, alpha) {
        let g = this.panelGraphics;
        if (!g) {
            g = this.add.graphics();
        }

        const key = "panel" + color + alpha;
        if (!this.textures.exists(key)) {
            g.fillStyle(color, alpha);
            g.fillRect(0, 0, 2, 2);
            g.generateTexture(key, 2, 2);
            g.setVisible(false);
        }

        let panel = this.add.image(x, y, key)
            .setDisplaySize(width, height)
            .setSize(width, height)
            .setInteractive();

        return panel;
    }

    resetShip(ship) {
        let x = Phaser.Math.Between(-100, 480);
        let y = -40;
        ship.setVisible(true);
        ship.setPosition(x, y);
    }

    update() {
        this.ships.forEach((ship) => {
            ship.y += ship.speed;
            ship.x += ship.speed;
            if (ship.y > this.scale.height) {
                this.resetShip(ship);
            }
        });
    }
}