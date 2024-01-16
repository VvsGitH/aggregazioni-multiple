import express, { json } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";

import { __dirname } from "./utils/node.js";
import router from "./routes/index.js";

// Create express server
const app = express();

// Configure middlewares
app.use(
  morgan("dev"), // automatic logging
  cors(), // enable all cors requests
  json() // parsing body of requests with Content-Type=application/json
);

// Serving FE assets on /
app.use("/", express.static(path.join(__dirname, "../../../client/dist/")));

// Add the main router
app.use("/api/v1", router);

// Make the express server listen to requests on PORT
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${chalk.green(PORT)}.`);
});

// Handling uncaught promises and errors (that happens outside of express) more gracefully
process.on("unhandledRejection", (err: Error) => {
  console.log(chalk.red(`Unhandled Rejection! ${err.name}: ${err.message}\n`), err.stack);
  server.close(() => {
    process.exit(1);
  });
});
