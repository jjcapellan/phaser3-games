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
 * Simple transition between two scenes.
 * @param {PhaserScene} srcScene 
 * @param {string} targetKey 
 * @param {number} duration 
 */
export function transition(srcScene, targetKey, duration) {
    srcScene.scene.launch(targetKey);
    const target = srcScene.scene.get(targetKey);
    target.cameras.main.alpha = 0;

    srcScene.tweens.chain({
        tweens: [
            {
                targets: srcScene.cameras.main,
                alpha: 0,
                duration: duration/2
            },
            {
                targets: target.cameras.main,
                alpha: 1,
                duration: duration/2,
                onComplete: () => {
                    srcScene.scene.stop();
                }
            }
        ]
    });        
}