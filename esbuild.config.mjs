import { build } from "esbuild";

// The app bundles this with its own tooling; Capacitor and the browser SDK stay peer imports.
await build({ entryPoints: ["src/index.ts"], bundle: true, target: "es2020", sourcemap: true, format: "esm", external: ["@capacitor/core", "@watchtowerobservability/browser"], outfile: "dist/index.js" });
