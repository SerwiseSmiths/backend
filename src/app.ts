// app.ts
import * as express from "express";
import type { Application, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import * as morgan from "morgan";

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

const app: Application = express();
app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const BASE_URL = "/api/v2";

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
// app.use(errorHandler);

export default app;
