import minimist from "minimist";
import { createRequire } from "module";
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import esbuild from "esbuild"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const args = minimist(process.argv.slice(2));

const target = args._[0];
const format = args.f || "iife"

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`)
console.log("entry", entry);

esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  // 打包到一个文件
  bundle: true,
  platform: "browser",
  sourcemap: true,
  format,
  globalName: pkg.buildOptions?.name,
}).then((ctx) => {
  console.log(`[${target}] start dev`);

  return ctx.watch()
})