import esbuild from "esbuild";
import { execSync } from "child_process";
import fs from "fs";

const build = async () => {
  try {
    console.log("Starting build process...");

    if (fs.existsSync("dist")) {
      fs.rmSync("dist", { recursive: true });
    }
    fs.mkdirSync("dist");

    console.log("Building frontend...");
    execSync("npx vite build", { stdio: "inherit" });

    console.log("Building backend...");
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    await esbuild.build({
      entryPoints: ["server/index.ts"],
      bundle: true,
      platform: "node",
      target: "node20",
      outfile: "dist/index.cjs",
      external: [...dependencies, ...devDependencies, "pg-native"],
      format: "cjs",
      sourcemap: true,
    });

    if (!fs.existsSync("dist/index.cjs")) {
      throw new Error("Build output dist/index.cjs was not generated");
    }

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

build();
