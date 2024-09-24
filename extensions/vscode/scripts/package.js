const { exec } = require("child_process");
const fs = require("fs");

const args = process.argv.slice(2);
let target;

if (args[0] === "--target") {
  target = args[1];
}

if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

const isPreRelease = args.includes("--pre-release");

let command = isPreRelease
  ? "npx --node-options=--inspect vsce package --out ./build patch --pre-release --no-dependencies" // --yarn"
  : "npx --node-options=--inspect vsce package --out ./build patch --no-dependencies"; // --yarn";

if (target) {
  command += ` --target ${target}`;
}

exec(command, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    "vsce package completed - extension created at extensions/vscode/build/continue-{version}.vsix",
  );
});
