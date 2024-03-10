import * as esbuild from "esbuild";
import { inFile, outFile } from "./current.js";

await esbuild.build({
    entryPoints: [
        { out: "libphaser", in: "shared-libs/src/phaser.js" }
    ],
    bundle: true,
    format: "iife",
    sourcemap: false,
    outdir: "shared-libs"
});

await esbuild.build({
    entryPoints: [
        { out: outFile, in: inFile }
    ],
    bundle: true,
    sourcemap: false,
    mainFields: ["module", "main", "browser"],
    define: { IS_DEV: "false" },
    outdir: "games",
});