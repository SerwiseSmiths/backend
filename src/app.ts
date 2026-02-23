// app.ts
import * as express from "express";
import type { Application, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import * as morgan from "morgan";
import { isProd } from "./config/env.config";

import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import addressRoutes from "./routes/address.route";
import deviceTypeRoutes from "./routes/deviceType.route";
import deviceRoutes from "./routes/device.route";
import geocodeRoutes from "./routes/geocode.route";
import complaintRoutes from "./routes/complaint.route";
import serviceRoutes from "./routes/service.route";
import quoteRoutes from "./routes/quote.route";
import subscriptionRoutes from "./routes/subscription.route";
import paymentRoutes from "./routes/payment.route";
import selfRoutes from "./routes/self.route";
import walletRoutes from "./routes/wallet.route";
import notificationRoutes from "./routes/notification.route";
import uploadRoutes from "./routes/upload.route";

import chatRoutes from "./routes/chat.route";
import circleRoutes from "./routes/circle.route";
import configRoutes from "./routes/config.route";
import healthRoutes from "./routes/health.route";

const app: Application = express();
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const BASE_URL = "/api/v2";

app.use(`${BASE_URL}/chat`, chatRoutes);
app.use(`${BASE_URL}/circle`, circleRoutes);
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/address`, addressRoutes);
app.use(`${BASE_URL}/device-type`, deviceTypeRoutes);
app.use(`${BASE_URL}/device`, deviceRoutes);
app.use(`${BASE_URL}/geocode`, geocodeRoutes);
app.use(`${BASE_URL}/service`, serviceRoutes);
app.use(`${BASE_URL}/quote`, quoteRoutes);
app.use(`${BASE_URL}/complaint`, complaintRoutes);
app.use(`${BASE_URL}/subscription`, subscriptionRoutes);
app.use(`${BASE_URL}/payment`, paymentRoutes);
app.use(`${BASE_URL}/me`, selfRoutes);
app.use(`${BASE_URL}/wallet`, walletRoutes);
app.use(`${BASE_URL}/notification`, notificationRoutes);
app.use(`${BASE_URL}/upload`, uploadRoutes);
app.use(`${BASE_URL}/config`, configRoutes);
app.use(`${BASE_URL}/health`, healthRoutes);
// app.use(errorHandler);

export default app;

