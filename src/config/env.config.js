"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.isDev = exports.NODE_ENV = exports.env = void 0;
/**
 * Single .env file with DEV_ and PROD_ prefixes.
 * On startup we copy the active prefix's values into unprefixed keys so the rest
 * of the app uses normal names (e.g. process.env.PORT, process.env.MONGODB_URL).
 *
 * Set NODE_ENV=development or NODE_ENV=production (unprefixed; can be in .env).
 * In .env use DEV_PORT, PROD_PORT, DEV_MONGODB_URL, PROD_MONGODB_URL, etc.
 */
const dotenv = require("dotenv");
// Load only the single .env file (no .env.development / .env.production)
dotenv.config();
const raw = process.env.NODE_ENV ?? "development";
const NODE_ENV = raw === "production" ? "production" : "development";
exports.NODE_ENV = NODE_ENV;
const PREFIX = NODE_ENV === "production" ? "PROD_" : "DEV_";
/**
 * Build object with unprefixed keys from the active prefix (DEV_ or PROD_).
 * Then assign to process.env so existing code using process.env.PORT etc. keeps working.
 */
const unprefixed = {};
for (const key of Object.keys(process.env)) {
    const val = process.env[key];
    if (val === undefined)
        continue;
    if (key.startsWith("PROD_")) {
        const base = key.slice(5);
        if (NODE_ENV === "production")
            unprefixed[base] = val;
    }
    else if (key.startsWith("DEV_")) {
        const base = key.slice(4);
        if (NODE_ENV === "development")
            unprefixed[base] = val;
    }
}
for (const [k, v] of Object.entries(unprefixed)) {
    process.env[k] = v;
}
/** Resolved env object (unprefixed names) for the current NODE_ENV. Use for typing or explicit access. */
exports.env = unprefixed;
exports.isDev = NODE_ENV === "development";
exports.isProd = NODE_ENV === "production";
//# sourceMappingURL=env.config.js.map