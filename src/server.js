"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const prisma_config_1 = require("./config/prisma.config");
const mongo_config_1 = require("./config/mongo.config");
const PORT = process.env.PORT || 3000;
(0, mongo_config_1.connectDB)();
(0, prisma_config_1.connectPrisma)();
app_1.default.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map