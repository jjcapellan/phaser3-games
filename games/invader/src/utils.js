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