"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const tip_service_js_1 = require("../services/tip.service.js");
const http_js_1 = require("../utils/http.js");
exports.api = (0, express_1.Router)();
exports.api.get("/home", async (_, res, next) => {
    try {
        (0, http_js_1.ok)(res, await tip_service_js_1.tips.home());
    }
    catch (e) {
        next(e);
    }
});
exports.api.get("/categories", async (_, res, next) => {
    try {
        (0, http_js_1.ok)(res, await tip_service_js_1.tips.categories());
    }
    catch (e) {
        next(e);
    }
});
exports.api.get("/categories/:slug/tips", async (req, res, next) => {
    try {
        (0, http_js_1.ok)(res, await tip_service_js_1.tips.byCategory(req.params.slug));
    }
    catch (e) {
        next(e);
    }
});
exports.api.get("/tips/search", async (req, res, next) => {
    try {
        const q = zod_1.z.string().trim().min(2).max(100).parse(req.query.q);
        (0, http_js_1.ok)(res, await tip_service_js_1.tips.search(q));
    }
    catch (e) {
        next(e);
    }
});
exports.api.get("/tips/:id/related", async (req, res, next) => {
    try {
        (0, http_js_1.ok)(res, await tip_service_js_1.tips.related(req.params.id));
    }
    catch (e) {
        next(e);
    }
});
exports.api.get("/tips/:id", async (req, res, next) => {
    try {
        const tip = await tip_service_js_1.tips.byId(req.params.id);
        tip ? (0, http_js_1.ok)(res, tip) : (0, http_js_1.fail)(res, 404, "Tip not found");
    }
    catch (e) {
        next(e);
    }
});
exports.api.post("/tips/:id/react", async (req, res, next) => {
    try {
        const bodySchema = zod_1.z.object({
            type: zod_1.z.enum(["helpful", "insightful", "practical"]).default("helpful"),
        });
        const parsed = bodySchema.parse(req.body || {});
        const tip = await tip_service_js_1.tips.react(req.params.id, parsed.type);
        tip ? (0, http_js_1.ok)(res, tip) : (0, http_js_1.fail)(res, 404, "Tip not found");
    }
    catch (e) {
        next(e);
    }
});
