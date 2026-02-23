import "./config/env.config";
import app from "./app";
// import {connectPrisma} from "./config/prisma.config";
import { connectDB } from "./config/mongo.config";
import { NODE_ENV } from "./config/env.config";

import { createServer } from "http";
import socketService from "./services/socket.service";

const PORT = process.env.PORT || 3000;

connectDB();

const httpServer = createServer(app);

socketService.initialize(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${NODE_ENV}]`);
});

