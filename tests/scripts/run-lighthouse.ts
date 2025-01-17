#!/usr/bin/env bun
import { spawn } from "node:child_process";

console.log("Starting Lighthouse CI...");

const lhci = spawn("bunx", ["@lhci/cli", "autorun"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    FORCE_COLOR: "1"
  }
});

lhci.on("error", (error) => {
  console.error("Failed to start Lighthouse CI:", error);
  process.exit(1);
});

lhci.on("close", (code) => {
  if (code !== 0) {
    console.error(`Lighthouse CI failed with code ${code}`);
    process.exit(1);
  }
  console.log("Lighthouse CI completed successfully");
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("Received SIGINT. Cleaning up...");
  lhci.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Cleaning up...");
  lhci.kill("SIGTERM");
});
