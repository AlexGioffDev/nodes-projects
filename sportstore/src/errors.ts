import { Express, ErrorRequestHandler } from "express";
import { getConfig } from "./config";

const template400 = getConfig("errors:400");
const template500 = getConfig("errors:500");

export const createErrorHandlers = (app: Express) => {
  app.use((req, res) => {
    res.statusCode = 404;
    res.render(template400);
  });

  const handler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error);
    if (res.headersSent) {
      return next(error);
    }
    try {
      res.statusCode = 500;
      res.render(template500, { error });
    } catch (newErr) {
      next(error);
    }
  };
  app.use(handler);
};
