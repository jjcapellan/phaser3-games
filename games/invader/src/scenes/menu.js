import LayerFactory from "phaser3-scrollinglayer";

export default class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        // Initial fadein effect
        this.cameras.main.fadeIn(1000);

        // Background sound
        const snd_background = this.sound.add("menu-background", { loop: true });
        snd_background.play();

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

        this.add.bitmapText(CENTER.x, CENTER.y / 3 + 40 * 2, "pixelfont", "click to play")
            .setOrigin(0.5);

        // Mouse input
        this.input.once("pointerdown", () => {
            snd_background.stop();
            this.cameras.main.fadeOut(1000);
            this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("gameplay"));
        });
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