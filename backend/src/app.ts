import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { reservationsRouter } from "./routes/reservations.routes.js";
import { contactMessagesRouter } from "./routes/contact-messages.routes.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.use(requestIdMiddleware);

app.use(healthRouter);
app.use(reservationsRouter);
app.use(contactMessagesRouter);

app.use(errorHandlerMiddleware);
