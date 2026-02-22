"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
// import {connectPrisma} from "./config/prisma.config";
const mongo_config_1 = require("./config/mongo.config");
const http_1 = require("http");
const socket_service_1 = require("./services/socket.service");
const PORT = process.env.PORT || 3000;
(0, mongo_config_1.connectDB)();
const httpServer = (0, http_1.createServer)(app_1.default);
socket_service_1.default.initialize(httpServer);
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map