const FRAMES = ["Shield-2", "Shield-1", "Shield-0"];
const GROUPS = 8;
const GROUP_SIZE = 4;

export default class Shields {

    constructor(scene, y) {

        this.activeShields = [];
        this.scene = scene;

        const SHIELD_WIDTH = scene.textures.getFrame("atlas", "Shield-0").width;
        const GROUP_WIDTH = GROUP_SIZE * SHIELD_WIDTH;
        const FREE_SPACE = scene.scale.width - GROUPS * GROUP_WIDTH;
        const GROUP_PADDING = FREE_SPACE / (GROUPS + 1);

        for (let i = 0; i < GROUPS; i++) {
            let x = GROUP_PADDING + i * (GROUP_WIDTH + GROUP_PADDING);
            for (let j = 0; j < GROUP_SIZE; j++) {
                let shield = scene.physics.add.staticImage(x + j * SHIELD_WIDTH, y, "atlas", "Shield-0");
                // Energy indicates current frame. If its value is 0 then is removed.
                shield.energy = 2;
                this.activeShields.push(shield);
            }
        }

    }

    hit(shield) {
        shield.energy--;
        if (shield.energy < 0) {
            this.activeShields.splice(this.activeShields.indexOf(shield), 1);
            shield.setActive(false);
            shield.setVisible(false);
            return;
        }
        shield.setFrame(FRAMES[shield.energy]);
    }

}