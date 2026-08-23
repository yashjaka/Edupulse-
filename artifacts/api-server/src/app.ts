import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({ method: req.method, url: req.url?.split("?")[0] }, "request");
  next();
});
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/", router);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled request error");
  res.status(500).json({ success: false, message: "Unable to connect to server. Please try again." });
});

export default app;
