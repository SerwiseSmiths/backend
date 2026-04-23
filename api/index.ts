// app.ts
import express from "express";
import type { Application, Request, Response } from "express";
import { errorHandler } from "../src/middlewares/errorHandler.middleware";
import morgan from "morgan";
import cors from "cors";
import { isProd } from "../src/config/env.config";

import userRoutes from "../src/routes/user.route";
import authRoutes from "../src/routes/auth.route";
import addressRoutes from "../src/routes/address.route";
import deviceRoutes from "../src/routes/device.route";
import geocodeRoutes from "../src/routes/geocode.route";
import complaintRoutes from "../src/routes/complaint.route";
import quoteRoutes from "../src/routes/quote.route";
import subscriptionRoutes from "../src/routes/subscription.route";
import paymentRoutes from "../src/routes/payment.route";
import selfRoutes from "../src/routes/self.route";
import walletRoutes from "../src/routes/wallet.route";
import notificationRoutes from "../src/routes/notification.route";
import uploadRoutes from "../src/routes/upload.route";

import chatRoutes from "../src/routes/chat.route";
import circleRoutes from "../src/routes/circle.route";
import configRoutes from "../src/routes/config.route";
import healthRoutes from "../src/routes/health.route";
import waitlistRoutes from "../src/routes/waitlist.route";
import contactRoutes from "../src/routes/contact.route";

const app: Application = express();
app.use(cors());
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const BASE_URL = "/api/v2";

app.use(`${BASE_URL}/chat`, chatRoutes);
app.use(`${BASE_URL}/circle`, circleRoutes);
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/address`, addressRoutes);
app.use(`${BASE_URL}/device`, deviceRoutes);
app.use(`${BASE_URL}/geocode`, geocodeRoutes);
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
app.use(`${BASE_URL}/waitlist`, waitlistRoutes);
app.use(`${BASE_URL}/contacts`, contactRoutes);
app.use(errorHandler);

export default app;

