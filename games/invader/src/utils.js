export const SOUND_LEVELS = {
    explode: 0.9,
    shoot: 0.2,
    crash: 0.6,
    metal: 0.2
};

// Represents an oscillating pattern. Used to animate images or sprites positions
const ANIM_POSITIONS_OSC = [
    -1, -0.9, -0.7, -0.4, 0, 0.4, 0.7, 0.9, 1, 0.9, 0.7, 0.4, 0, -0.4, -0.7, -0.9
];

/**
 * Generates positions to make an animation based in an oscillating pattern
 * @param {number} range Represents the amplitude of motion. Example: 20 generates positions
 * from -10 to +10.
 * @returns {number[]}
 */
export function genOscPositions(range) {
    range = Math.floor(range / 2);
    return ANIM_POSITIONS_OSC.map(position => range * position);
}

/**
 * Calculates audio pan value for game object position
 * @param {*} x Position of the sound (pixels)
 * @param {*} width Width of the viewport (pixels)
 * @returns number between -1 and 1
 */
export function getPan(x, width) {
    return (2 * x - width) / width;
}

/**
 * Creates a simple rectangular image. This image is interactive so it blocks events 
 * for objects behind it. This is especially useful for modal windows. 
 * @param {Phaser.Scene} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {number} color 
 * @param {number} alpha 
 * @returns {Phaser.GameObjects.Image}
 */
export function addPanel(scene, x, y, width, height, color, alpha) {
    let g = scene.panelGraphics;
    if (!g) {
        g = scene.add.graphics();
    }

    const key = "panel" + color + alpha;
    if (!scene.textures.exists(key)) {
        g.fillStyle(color, alpha);
        g.fillRect(0, 0, 2, 2);
        g.generateTexture(key, 2, 2);
        g.setVisible(false);
    }

    let panel = scene.add.image(x, y, key)
        .setDisplaySize(width, height)
        .setSize(width, height)
        .setInteractive();

    return panel;
}