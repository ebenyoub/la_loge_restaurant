import "dotenv/config";

function parsePort(value: string | undefined): number {
  const port = Number(value ?? "4000");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT doit être un entier compris entre 1 et 65535.");
  }

  return port;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET ?? "default-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
};

export function requireDatabaseConfiguration() {
  if (!env.databaseUrl) {
    throw new Error("Configuration MySQL incomplète : DATABASE_URL est manquante.");
  }

  return {
    databaseUrl: env.databaseUrl,
  };
}
