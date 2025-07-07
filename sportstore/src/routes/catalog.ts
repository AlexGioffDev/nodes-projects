import { Express } from "express";
import { catalog_repository } from "../data";

export const createCatalogRoutes = (app: Express) => {
  app.get("/", async (req, res) => {
    const page = Number.parseInt(req.query.page?.toString() ?? "1");
    const pageSize = Number.parseInt(req.query.pageSize?.toString() ?? "3");
    const searchTerm = req.query.searchTerm?.toString();
    const category = Number.parseInt(req.query.category?.toString() ?? "");
    const results = await catalog_repository.getProducts({
      page,
      pageSize,
      searchTerm,
      category,
    });
    res.render("index", {
      ...results,
      page,
      pageSize,
      pageCount: Math.ceil(results.totalCount / (pageSize ?? 1)),
      searchTerm,
      category,
    });
  });

  app.get("/err", (req, res) => {
    throw new Error("Something bad happend");
  });

  app.get("/asyncerr", async (req, res) => {
    throw new Error("Somethign bad happend with async data");
  });
};
