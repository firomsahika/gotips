import type { Response } from "express";
export const ok = <T>(res: Response, data: T, message = "Success") =>
  res.json({ success: true, data, message });
export const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, data: null, message });
