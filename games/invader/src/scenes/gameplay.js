import Player from "../custom-objs/player.js";
import Enemies from "../custom-objs/enemies.js";
import Shields from "../custom-objs/shields.js";

export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    }

    create() {

        // Initial fadein effect
        this.cameras.main.fadeIn(1000);

        this.score = 0;

        this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(0x888888);
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(0x666666);

        // Player smoke effect
        this.prtSmoke = this.add.particles(49, this.scale.height - 20, "atlas",
            {
                frame: "Smoke-0",
                lifespan: 3000,
                scale: { start: 0.5, end: 0 },
                alpha: { max: 0.8, min: 0.3 },
                speed: 6,
                angle: { min: -160, max: -84 },
                gravityY: -10,
                emitting: false
            });

        this.player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
        this.enemies = new Enemies(this);

        this.prtShieldHit = this.add.particles(0, 0, "atlas", {
            frame: "Particle-yellow",
            lifespan: 600,
            speed: { min: 10, max: 20 },
            scale: { max: 1, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 4,
            emitting: false
        });
        this.shields = new Shields(this, this.player.y - 40);

        // Explosion effect
        this.prtExplosion = this.add.particles(0, 0, "atlas", {
            frame: "Particle-yellow",
            lifespan: 2000,
            speed: { min: 20, max: 90 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            blendMode: "add",
            emitting: false,
            rotate: { max: 359, min: 0 }
        });

        // Crash effect on the ground
        this.prtCrash = this.add.particles(0, 0, "atlas", {
            frame: "Smoke-0",
            lifespan: 1000,
            speed: { min: 10, max: 20 },
            scale: { max: 2, min: 0.5 },
            alpha: { start: 1, end: 0 },
            gravityY: 4,
            emitting: false
        });

        this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);

        this.addHud();

        this.addColliders();

        this.cameraFX = this.cameras.main.postFX.addColorMatrix();

        this.txtGameOver = this.add.bitmapText(CENTER.x, CENTER.y - 40, "pixelfont", "game over")
            .setVisible(false)
            .setOrigin(0.5);
        this.txtClick = this.add.bitmapText(CENTER.x, CENTER.y + 20, "pixelfont", "click to return")
            .setVisible(false)
            .setOrigin(0.5);

        this.events.on("enemies-ready", this.onEnemiesReady, this);

        this.events.once("shutdown", () => {
            this.events.off("enemies-ready");
            this.enemiesShootTimer.remove(false);
            this.enemies = null;
            this.player = null;
        });
    }

    addColliders() {
        this.physics.world.on("worldbounds", (body, up, down) => {
            if (down) {
                body.enable = false;
                this.sound.play("ground");
                this.prtCrash.emitParticle(10, body.x, body.y);
                if (body.width == this.player.width) {
                    this.prtSmoke.x = this.player.x;
                    this.prtSmoke.y = this.player.y;
                    this.prtSmoke.emitting = true;
                }
            }
        });

        this.physics.add.collider(this.player.bullet, this.enemies.activeEnemies, (bullet, enemy) => {
            bullet.reset();
            this.prtExplosion.emitParticle(40, enemy.x, enemy.y);
            this.sound.play("explode");
            this.enemies.explode(enemy);
            this.updateScore(enemy.score);
        });

        this.physics.add.collider(this.player, [this.enemies.bullets, ...this.enemies.activeEnemies], () => {
            this.prtExplosion.emitParticle(60, this.player.x, this.player.y);
            this.player.explode();
            this.enemiesShootTimer.remove(false);
            this.enemies.regroup();
            this.cameraFX.desaturateLuminance();
            this.sound.play("explode", { rate: 0.5 });
            this.txtGameOver.setVisible(true);
            this.tweens.add({
                targets: this.txtGameOver,
                scale: 8,
                duration: 2000,
                onComplete: () => {
                    this.txtClick.setVisible(true);
                    this.input.once("pointerdown", () => {
                        this.cameras.main.fadeOut(1000);
                        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("menu"));
                    });
                }
            });
        });

        this.physics.add.collider(this.shields.activeShields, this.enemies.bullets, (shield, bullet) => {
            bullet.reset();
            this.prtShieldHit.setPosition(shield.x, shield.y - shield.height / 2);
            this.prtShieldHit.particleAngle = { min: -135, max: -45 };
            this.prtShieldHit.emitParticle(10);
            this.shields.hit(shield);
        });

        this.physics.add.collider(this.player.bullet, this.shields.activeShields, (bullet, shield) => {
            bullet.reset();
            this.prtShieldHit.setPosition(shield.x, shield.y + shield.height / 2);
            this.prtShieldHit.particleAngle = { min: 135, max: 45 };
            this.prtShieldHit.emitParticle(10);
            this.shields.hit(shield);
        });
    }

    addHud() {
        this.add.bitmapText(4, 4, "pixelfont", "score");
        this.txtScore = this.add.bitmapText(44, 4, "pixelfont", "0");
    }

    updateScore(points) {
        this.score += points;
        this.txtScore.setText(this.score);
    }

    onEnemiesReady() {
        this.enemiesShootTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.enemies.shoot();
            },
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        this.enemies.update(delta);
    }
}