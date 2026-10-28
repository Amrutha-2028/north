import { spawn } from "node:child_process";
import process from "node:process";
import { resolve } from "node:path";
import { createServer, loadEnv } from "vite";

const host = "127.0.0.1";
const port = 4173;
const viteEnv = loadEnv("development", process.cwd(), "VITE_");
const projectRef = new URL(viteEnv.VITE_SUPABASE_URL).hostname.split(".")[0];
const server = await createServer({
  server: { host, port, strictPort: true },
});

try {
  await server.listen();
  const cli = resolve("node_modules/@playwright/test/cli.js");
  const runner = spawn(process.execPath, [cli, "test", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: `http://${host}:${port}`,
      PLAYWRIGHT_AUTH_STORAGE_KEY: `sb-${projectRef}-auth-token`,
    },
  });

  const exitCode = await new Promise((resolveExit) => {
    runner.once("error", (error) => {
      console.error("Could not start Playwright:", error);
      resolveExit(1);
    });
    runner.once("close", (code) => resolveExit(code ?? 1));
  });
  process.exitCode = exitCode;
} finally {
  await server.close();
}
