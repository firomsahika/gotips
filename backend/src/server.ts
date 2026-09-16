import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
import { api } from "./routes/api.js";
import { fail } from "./utils/http.js";


const app = express();


app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use("/api/v1", api);
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof ZodError) return fail(res, 400, "Invalid request");
    console.error(err);
    return fail(res, 500, "Something went wrong");
  },
);
const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => console.log(`GoTips API listening on ${port}`));
