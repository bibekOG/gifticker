import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimit } from "./middleware/rateLimit.js";
import articleRoutes from "./routes/articles.js";
import newsletterRoutes from "./routes/newsletter.js";
import uploadRoutes from "./routes/upload.js";
import { getHealth } from "./controllers/health.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(rateLimit());

app.get("/api/health", getHealth);
app.use("/api/articles", articleRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);

export default app;
