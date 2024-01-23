import LayerFactory from "phaser3-scrollinglayer";
import TextMenu from "../custom-objs/txtmenu";

export default class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    init() {
        this.closing = false;
    }

    create() {
        // Initial fadein effect
        this.cameras.main.fadeIn(1000);

        // Background sound
        this.snd_background = this.sound.add("menu-background", { loop: true });
        this.snd_background.play();

        // Background image (sky and sun)
        this.add.image(0, 0, "atlas", "Background-0")
            .setOrigin(0);

        this.ships = [];
        this.addShip(-50, -10, "Enemy_spin-0");
        this.addShip(-200, -300, "Enemy_spin-0");
        this.addShip(-500, -550, "Enemy_spin-0");

        // Explosion effect
        this.explode = this.add.particles(0, 0, "atlas", {
            frame: "Particle-blue",
            lifespan: 8000,
            speed: { min: 2, max: 15 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 5,
            emitting: false,
            rotate: { max: 359, min: 0 }
        });

        // One ship could explode every 10 seconds
        this.time.addEvent({ delay: 1000 * 10, callback: this.explodeShip, callbackScope: this, loop: true });

        // Image layer 3
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0")
            .setOrigin(0, 1);

        // Image layer 2
        this.add.image(0, this.scale.height, "atlas", "Ruins2-0")
            .setOrigin(0, 1);

        // Smoke effect
        this.add.particles(49, this.scale.height - 20, "atlas",
            {
                frame: "Smoke-0",
                lifespan: 3000,
                scale: { start: 0.5, end: 0 },
                alpha: { max: 0.8, min: 0.3 },
                speed: 6,
                angle: { min: -100, max: -84 },
                gravityY: -10,
            });

        // Fog effect
        this.add.existing(new LayerFactory(this, "atlas"))
            .addHlayer(this.scale.height - 30, -10, "Fog-0")
            .setOverlap(0);

        // First plane image
        this.add.image(0, this.scale.height, "atlas", "Ruins1-0")
            .setOrigin(0, 1);

        // Texts
        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40, "pixelfont", "invader")
            .setScale(8)
            .setTint(0x1a1c2c)
            .setOrigin(0.5);

        // Menu
        this.menu = new TextMenu(this, CENTER.x, CENTER.y / 3 + 40 * 3, "pixelfont",
            [
                { name: "controls", fn: this.showHowToPlay },
                { name: "play", fn: this.changeScene }
            ],
            {
                color: 0x566c86,
                hoverColor: 0xb13e53,
                padding: 8
            });
        this.menu.setScale(2);

        // Modal dialog background
        this.panel = this.addPanel(CENTER.x, CENTER.y, 400, 290, 0x000000, 0.95)
            .setVisible(false);
        this.howToPlay = this.createHowToPlay().setOrigin(0.5).setPosition(CENTER.x, CENTER.y)
            .setVisible(false);
        this.panel.on("pointerdown", this.hideHowToPlay, this);
        this.events.once("shutdown", () => {
            this.events.off("pointerdown");
        });
    }

    changeScene() {
        if (this.closing) return;
        this.closing = true;
        this.snd_background.stop();
        this.cameras.main.fadeOut(1000);
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
        let ship = this.add.sprite(x, y, "atlas", texture);
        ship.setScale(0.5);
        ship.setAngle(-45);
        ship.speed = 0.1;
        ship.playAfterDelay("enemy-falling", Phaser.Math.Between(100, 1000));
        this.ships.push(ship);
    }

    explodeShip() {
        let ship = null;
        for (let i = 0; i < this.ships.length; i++) {
            if (this.ships[i].y > 180) {
                ship = this.ships[i];
                break;
            }
        }

        if (!ship || !ship.visible) return;

        this.explode.setPosition(ship.x, ship.y);
        this.explode.emitParticle(40);
        ship.setVisible(false);
    }

    createHowToPlay() {
        const rt = this.add.renderTexture(0, 0, 400, 290);
        let cx = rt.width / 2;

        let title = this.make.bitmapText({ font: "pixelfont", text: "how to play", scale: 3 }, false)
            .setOrigin(0.5);
        rt.draw(title, cx, 30);

        let txt2 = this.make.bitmapText({
            font: "pixelfont",
            text: "player          enemy"
        },
            false)
            .setOrigin(0.5);
        rt.draw(txt2, cx, 56);

        rt.drawFrame("atlas", "Player-0", 132, 70);
        rt.drawFrame("atlas", "Enemy-0", 246, 66);

        let txt3 = this.make.bitmapText({
            font: "pixelfont",
            text: "objective",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(0xffcd75);
        rt.draw(txt3, cx, 115);

        let txt4 = this.make.bitmapText({
            font: "pixelfont",
            text: "destroy all enemies.",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(0xababab);
        rt.draw(txt4, cx, 130);

        let txt5 = this.make.bitmapText({
            font: "pixelfont",
            text: "controls",
            scale: 1,
        }, false)
            .setOrigin(0.5)
            .setTint(0xffcd75);
        rt.draw(txt5, cx, 155);

        let txt6 = this.make.bitmapText({
            font: "pixelfont",
            text: "left  .......  a,left\n" +
                "right ....... d,right\n" +
                "shoot .......   space\n\n" +
                "or use gamepad",
            scale: 1,
        }, false)
            .setOrigin(0.5, 0)
            .setTint(0xababab);
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