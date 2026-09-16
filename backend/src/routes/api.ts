import { Router } from "express";
import { z } from "zod";
import { tips } from "../services/tip.service.js";
import { fail, ok } from "../utils/http.js";
export const api = Router();


api.get("/home", async (_, res, next) => {
  try {
    ok(res, await tips.home());
  } catch (e) {
    next(e);
  }
});
api.get("/categories", async (_, res, next) => {
  try {
    ok(res, await tips.categories());
  } catch (e) {
    next(e);
  }
});
api.get("/categories/:slug/tips", async (req, res, next) => {
  try {
    ok(res, await tips.byCategory(req.params.slug));
  } catch (e) {
    next(e);
  }
});
api.get("/tips/search", async (req, res, next) => {
  try {
    const q = z.string().trim().min(2).max(100).parse(req.query.q);
    ok(res, await tips.search(q));
  } catch (e) {
    next(e);
  }
});
api.get("/tips/:id/related", async (req, res, next) => {
  try {
    ok(res, await tips.related(req.params.id));
  } catch (e) {
    next(e);
  }
});
api.get("/tips/:id", async (req, res, next) => {
  try {
    const tip = await tips.byId(req.params.id);
    tip ? ok(res, tip) : fail(res, 404, "Tip not found");
  } catch (e) {
    next(e);
  }
});
