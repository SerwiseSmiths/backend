import "dotenv/config";
import app from "./app";
// import {connectPrisma} from "./config/prisma.config";
import { connectDB } from "./config/mongo.config";


import { createServer } from "http";
import socketService from "./services/socket.service";

const PORT = process.env.PORT || 3000;

connectDB();

const httpServer = createServer(app);

socketService.initialize(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

