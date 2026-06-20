import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { requireDatabaseConfiguration } from "../config/env.js";

// Validate that database configuration is present
const config = requireDatabaseConfiguration();

const adapter = new PrismaMariaDb(config.databaseUrl);

export const prisma = new PrismaClient({ adapter });
