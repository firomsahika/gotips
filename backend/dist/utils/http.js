"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
const ok = (res, data, message = "Success") => res.json({ success: true, data, message });
exports.ok = ok;
const fail = (res, status, message) => res.status(status).json({ success: false, data: null, message });
exports.fail = fail;
