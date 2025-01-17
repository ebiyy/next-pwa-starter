#!/usr/bin/env bun
import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

console.log("Starting Lighthouse CI...");

async function runLighthouse() {
  try {
    // Create .lighthouseci directory if it doesn't exist
    if (!existsSync(".lighthouseci")) {
      await mkdir(".lighthouseci", { recursive: true });
    }

    // Start Next.js server
    console.log("Starting Next.js server...");
    const server = spawn("bun", ["run", "start"], {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // Run Lighthouse CI collect
      console.log("Running Lighthouse CI collect...");
      execSync("bunx @lhci/cli collect --config=./lighthouserc.json", {
        stdio: "inherit",
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });

      // Debug: List and read result files
      const files = await readdir(".lighthouseci");
      console.log("Generated files:", files);

      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await readFile(join(".lighthouseci", file), "utf8");
          console.log(`Content of ${file}:`, content);
        }
      }

      // Run Lighthouse CI assert
      console.log("Running Lighthouse CI assert...");
      execSync("bunx @lhci/cli assert --config=./lighthouserc.json", {
        stdio: "inherit",
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });

      // Run Lighthouse CI upload
      console.log("Running Lighthouse CI upload...");
      execSync("bunx @lhci/cli upload --config=./lighthouserc.json", {
        stdio: "inherit",
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });

      console.log("Lighthouse CI completed successfully");
    } finally {
      // Cleanup: Stop the server
      server.kill();
    }
  } catch (error) {
    console.error("Lighthouse CI failed:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("Received SIGINT. Cleaning up...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Cleaning up...");
  process.exit(0);
});

runLighthouse();
