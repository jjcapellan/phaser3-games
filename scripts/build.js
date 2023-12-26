import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: [
        { out: "libphaser", in: "shared-libs/phaser.js" }
    ],
    bundle: true,
    format: "iife",
    sourcemap: false,
    outdir: "shared-libs"
});

await esbuild.build({
    entryPoints: [
        { out: "test-game/build/game", in: "games/test-game/src/index.js" }
    ],
    bundle: true,
    sourcemap: false,
    define: { IS_DEV: "false" },
    outdir: "games",
});