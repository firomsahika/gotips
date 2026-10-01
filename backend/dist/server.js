"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = require("zod");
const api_js_1 = require("./routes/api.js");
const http_js_1 = require("./utils/http.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.static("public"));
app.use("/api", (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use("/api/v1", api_js_1.api);
app.use((err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError)
        return (0, http_js_1.fail)(res, 400, "Invalid request");
    console.error(err);
    return (0, http_js_1.fail)(res, 500, "Something went wrong");
});
const port = Number(process.env.PORT ?? 5000);
app.listen(port, "0.0.0.0", () => console.log(`GoTips API listening on ${port}`));
