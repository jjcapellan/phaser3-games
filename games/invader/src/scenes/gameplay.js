import Enemy from "../custom-objs/enemy.js";
import Player from "../custom-objs/player.js";
import Enemies from "../custom-objs/enemies.js";

export default class GamePlay extends Phaser.Scene {
    constructor() {
        super("gameplay");
    }

    create() {
        this.anchor = {
            x: CENTER.x,
            y: CENTER.y
        };

        this.add.image(0, 0, "atlas", "Background-0").setOrigin(0).setTint(0x888888);
        this.add.image(0, this.scale.height, "atlas", "Ruins3-0").setOrigin(0, 1).setTint(0x666666);
        this.add.existing(new Player(this, CENTER.x, this.scale.height - 20));
        this.add.existing(new Enemies(this));
        this.add.image(0, this.scale.height, "atlas", "Floor-0").setOrigin(0, 1);
    }
}