import Player from "../custom-objs/player.js";
import Enemies from "../custom-objs/enemies.js";
import Shields from "../custom-objs/shields.js";
import { SOUND_LEVELS } from "../utils.js";

const PRT_CONFIG_SHIELD = {
    frame: "Particle-yellow",
    lifespan: 600,
    speed: { min: 10, max: 20 },
    scale: { max: 1, min: 0.5 },
    alpha: { start: 1, end: 0 },
    gravityY: 4,
    emitting: false
};

const PRT_CONFIG_SMOKE = {
    frame: "Smoke-0",
    lifespan: 3000,
    scale: { start: 0.5, end: 0 },
    alpha: { max: 0.8, min: 0.3 },
    speed: 6,
    angle: { min: -160, max: -84 },
    gravityY: -10,
    emitting: false
};

const PRT_CONFIG_EXPLOSION = {
    frame: "Particle-yellow",
    lifespan: 2000,
    speed: { min: 20, max: 90 },
    scale: { max: 2, min: 0.5 },
    alpha: { start: 1, end: 0 },
    blendMode: "add",
    emitting: false,
    rotate: { max: 359, min: 0 }
};

const PRT_CONFIG_CRASH = {
    frame: "Smoke-0",
    lifespan: 1000,
    speed: { min: 10, max: 20 },
    scale: { max: 2, min: 0.5 },
    alpha: { start: 1, end: 0 },
    gravityY: 4,
    emitting: false
};

const HIT_SCORE = 200;

export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    };

    init() {
        this.score = 0;
        this.totalShoots = 0;
        this.hits = 0;
        this.best = 0;
        this.accuracy = 0;
    }

    create() {
        // Initial camera fadein effect
        this.cameras.main.fadeIn(1000);
        // Initialize persistent high score
        const best = window.localStorage.getItem("best");
        if (best == null) {
            window.localStorage.setItem("best", "0");
        } else {
            this.best = best;
        }
        // Background image layer
        this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(0x888888);
        // Second image layer
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(0x666666);
        // Player smoke effect after hit
        this.prtSmoke = this.add.particles(49, this.scale.height - 20, "atlas", PRT_CONFIG_SMOKE);
        // Player ship
        this.player = this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
        // Group of enemies
        this.enemies = new Enemies(this);
        // Shield hit effect
        this.prtShieldHit = this.add.particles(0, 0, "atlas", PRT_CONFIG_SHIELD);
        // Groups of shields
        this.shields = new Shields(this, this.player.y - 40);
        // Explosion effect
        this.prtExplosion = this.add.particles(0, 0, "atlas", PRT_CONFIG_EXPLOSION);
        // Crash effect on the ground
        this.prtCrash = this.add.particles(0, 0, "atlas", PRT_CONFIG_CRASH);
        // Front image layer
        this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);
        // Colliders
        this.addColliders();
        // Camera effect used in game over
        this.cameraFX = this.cameras.main.postFX.addColorMatrix();
        // Text labels
        this.addTextLabels();
        // Events
        this.addEvents();

    }

    addColliders() {
        this.physics.world.on("worldbounds", (body, up, down) => {
            if (down) {
                body.enable = false;
                this.sound.play("ground", { volume: SOUND_LEVELS.crash });
                this.prtCrash.emitParticle(10, body.x, body.y);
                if (body.width == this.player.width) {
                    this.prtSmoke.x = this.player.x;
                    this.prtSmoke.y = this.player.y;
                    this.prtSmoke.emitting = true;
                }
                this.cameras.main.shake(100, 0.01);
            }
        });

        const bulletCollider = this.physics.add.collider(this.player.bullet, this.enemies.activeEnemies, (bullet, enemy) => {
            bullet.reset();
            this.prtExplosion.emitParticle(40, enemy.x, enemy.y);
            this.sound.play("explode", { volume: SOUND_LEVELS.explode });
            this.enemies.explode(enemy);
            this.hits++;
            this.accuracy = Math.round((this.hits / this.totalShoots) * 100) / 100;
            this.updateScore(Math.round(HIT_SCORE * this.accuracy));
        });

        this.physics.add.collider(this.player, [this.enemies.bullets, ...this.enemies.activeEnemies], () => {
            this.prtExplosion.emitParticle(60, this.player.x, this.player.y);
            this.player.explode();
            bulletCollider.active = false;
            this.gameOver();
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

    addEvents() {
        this.events.once("enemies-ready", this.onEnemiesReady, this);
        this.events.on("player-shoot", () => this.totalShoots++);
        this.events.once("shutdown", () => {
            this.events.off("enemies-ready");
            this.enemiesShootTimer.remove(false);
            this.enemies = null;
            this.player = null;
        });
    }

    addTextLabels() {
        this.add.bitmapText(20, 8, "pixelfont", "score")
            .setOrigin(0.5)
            .setDepth(100);
        this.txtScore = this.add.bitmapText(20, 16 + 1, "pixelfont", "0")
            .setOrigin(0.5)
            .setDepth(100);
        this.add.bitmapText(this.scale.width - 40, 8, "pixelfont", "high score")
            .setOrigin(0.5)
            .setDepth(100);
        this.txtBest = this.add.bitmapText(this.scale.width - 40, 16 + 1, "pixelfont", this.best)
            .setOrigin(0.5)
            .setDepth(100);
        this.txtGameOver = this.add.bitmapText(CENTER.x, CENTER.y - 40, "pixelfont", "game over")
            .setVisible(false)
            .setOrigin(0.5)
            .setDepth(100);
        this.txtNewScore = this.add.bitmapText(CENTER.x, CENTER.y + 10, "pixelfont", "")
            .setVisible(false)
            .setOrigin(0.5)
            .setScale(2);
        this.txtClick = this.add.bitmapText(CENTER.x, CENTER.y + 40, "pixelfont", "click to return")
            .setVisible(false)
            .setOrigin(0.5)
            .setDepth(100);
    }

    gameOver() {
        this.enemiesShootTimer.remove(false);
        this.enemies.regroup();
        this.cameraFX.desaturateLuminance();
        this.sound.play("explode", { volume: SOUND_LEVELS.explode, rate: 0.5 });
        this.txtGameOver.setVisible(true);

        if (this.score > this.best) {
            this.best = this.score;
            window.localStorage.setItem("best", this.score);
            this.txtBest.setText(this.best);
        }

        this.tweens.add({
            targets: this.txtGameOver,
            scale: 8,
            duration: 2000,
            onComplete: () => {
                this.sound.play("gameover");
                this.txtNewScore.setVisible(true)
                    .setText("score " + this.score + " pts");
                this.txtClick.setVisible(true);
                this.input.once("pointerdown", () => {
                    this.sound.stopAll();
                    this.cameras.main.fadeOut(1000);
                    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("menu"));
                });
            }
        });
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