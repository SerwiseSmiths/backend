"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env.config");
const app_1 = require("./app");
// import {connectPrisma} from "./config/prisma.config";
const mongo_config_1 = require("./config/mongo.config");
const env_config_1 = require("./config/env.config");
const http_1 = require("http");
const socket_service_1 = require("./services/socket.service");
const subscription_cron_1 = require("./jobs/subscription.cron");
const PORT = process.env.PORT || 3000;
(0, mongo_config_1.connectDB)();
(0, subscription_cron_1.startSubscriptionCron)();
const httpServer = (0, http_1.createServer)(app_1.default);
socket_service_1.default.initialize();
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${env_config_1.NODE_ENV}]`);
});
//# sourceMappingURL=server.js.map