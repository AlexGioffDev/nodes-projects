import { createServer } from "http";
import express, { Express } from "express";
import helmet from "helmet";
import { getConfig } from "./config";
import { createRoutes } from "./routes";
import { createTemplates } from "./helpers";
import { createErrorHandlers } from "./errors";

const port = getConfig("http:port", 3000);

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("node_modules/bootstrap/dist"));
createTemplates(app);

createRoutes(app);
createErrorHandlers(app);

const server = createServer(app);

server.listen(port, () => console.log(`HTTP Server listenint on port ${port}`));
