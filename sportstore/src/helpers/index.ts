import { Express } from "express";
import { getConfig } from "../config";
import { engine } from "express-handlebars";
import * as env_helpers from "./env";
import * as catalog_heplers from "./catalog_helpers";
const location = getConfig("templates:location");
const config = getConfig("templates:config");

export const createTemplates = (app: Express) => {
  app.set("views", location);
  app.engine(
    "handlebars",
    engine({
      ...config,
      helpers: { ...env_helpers, ...catalog_heplers },
    })
  );
  app.set("view engine", "handlebars");
};
