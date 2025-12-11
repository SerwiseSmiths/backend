"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPrisma = void 0;
const client_1 = require("../generated/prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"], // optional for debugging
});
const connectPrisma = async () => {
    prisma.$connect()
        .then(() => console.log("✅ SQL DB Connected"))
        .catch(err => console.error("❌ SQL DB Error:", err));
};
exports.connectPrisma = connectPrisma;
exports.default = prisma;
//# sourceMappingURL=prisma.config.js.map