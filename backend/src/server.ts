import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.info(`La Loge backend listening on port ${env.port}.`);
});

function shutdown(signal: string) {
  server.close(() => {
    console.info(`La Loge backend stopped after ${signal}.`);
    process.exit(0);
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
