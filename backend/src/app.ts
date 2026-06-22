import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { reservationsRouter } from "./routes/reservations.routes.js";
import { contactMessagesRouter } from "./routes/contact-messages.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminReservationsRouter } from "./routes/admin-reservations.routes.js";
import { adminSettingsRouter } from "./routes/admin-settings.routes.js";
import { adminCategoriesRouter } from "./routes/admin-categories.routes.js";
import { adminItemsRouter } from "./routes/admin-items.routes.js";
import { adminContactsRouter } from "./routes/admin-contacts.routes.js";
import { adminLegalRouter } from "./routes/admin-legal.routes.js";
import { publicRouter } from "./routes/public.routes.js";

import cors from "cors";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

if (env.corsOrigin) {
  const origins = env.corsOrigin.split(",").map(o => o.trim());
  allowedOrigins.push(...origins);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Allow local network origins in non-production environments for mobile/tablet testing
    if (process.env.NODE_ENV !== "production") {
      try {
        const parsedUrl = new URL(origin);
        const hostname = parsedUrl.hostname;
        if (
          hostname.startsWith("192.168.") ||
          hostname.startsWith("10.") ||
          hostname.startsWith("172.") ||
          hostname.endsWith(".local")
        ) {
          return callback(null, true);
        }
      } catch {
        // Ignored
      }
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(requestIdMiddleware);

app.use(healthRouter);
app.use(reservationsRouter);
app.use(contactMessagesRouter);
app.use(authRouter);
app.use(adminReservationsRouter);
app.use(adminSettingsRouter);
app.use(adminCategoriesRouter);
app.use(adminItemsRouter);
app.use(adminContactsRouter);
app.use(adminLegalRouter);
app.use(publicRouter);


app.use(errorHandlerMiddleware);
