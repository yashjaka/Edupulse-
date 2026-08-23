import app from "./app.js";
import { logger } from "./lib/logger.js";

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

app.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
