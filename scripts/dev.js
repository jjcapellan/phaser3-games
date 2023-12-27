import * as esbuild from "esbuild";
import { inFile, outFile } from "./current.js";

await esbuild.build({
    entryPoints: [
        { out: "libphaser", in: "shared-libs/phaser.js" }
    ],
    bundle: true,
    format: "iife",
    sourcemap: false,
    outdir: "shared-libs"
});

let ctx = await esbuild.context({
    entryPoints: [
        { out: outFile, in: inFile }
    ],
    bundle: true,
    sourcemap: true,
    define: { IS_DEV: "true" },
    outdir: "games",
});

await ctx.watch();

let { host, port } = await ctx.serve({
    servedir: "./",
});
console.log(`Starting local server at port ${port}`);