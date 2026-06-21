import "dotenv/config";

function parsePort(value: string | undefined): number {
  const port = Number(value ?? "4000");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT doit être un entier compris entre 1 et 65535.");
  }

  return port;
}

function parseJwtSecret(value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error("Configuration de sécurité incomplète : JWT_SECRET est manquante.");
  }
  if (value.length < 32) {
    throw new Error("Configuration de sécurité incomplète : JWT_SECRET doit faire au moins 32 caractères.");
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: parseJwtSecret(process.env.JWT_SECRET),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  smtpHost: process.env.SMTP_HOST ?? "smtp-relay.brevo.com",
  smtpPort: Number(process.env.SMTP_PORT ?? "587"),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS ?? process.env.EMAIL_PROVIDER_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  restaurantNotificationEmail: process.env.RESTAURANT_NOTIFICATION_EMAIL,
};

export function requireDatabaseConfiguration() {
  if (!env.databaseUrl) {
    throw new Error("Configuration MySQL incomplète : DATABASE_URL est manquante.");
  }

  return {
    databaseUrl: env.databaseUrl,
  };
}
