import type { Request, Response } from "express";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

/**
 * App version config per app (radix = provider app, serwise = customer app).
 * Update these when you release a new version, or use env vars.
 */
const APP_VERSION_CONFIG: Record<string, { latestVersion: string; minRequiredVersion: string; storeUrl: string }> = {
  radix: {
    latestVersion: process.env.RADIX_LATEST_VERSION || "1.0.0",
    minRequiredVersion: process.env.RADIX_MIN_REQUIRED_VERSION || "0.0.3",
    storeUrl: process.env.RADIX_STORE_URL || "https://play.google.com/store/apps/details?id=group.suyog.radix",
  },
  serwise: {
    latestVersion: process.env.SERWISE_LATEST_VERSION || "1.0.0",
    minRequiredVersion: process.env.SERWISE_MIN_REQUIRED_VERSION || "0.2.1",
    storeUrl: process.env.SERWISE_STORE_URL || "https://play.google.com/store/apps/details?id=com.serwise",
  },
};

/**
 * GET /config/app-version?app=radix|serwise
 * Public endpoint. Returns latest version, minimum required version, and store URL.
 * Client compares current app version:
 *   - If current < minRequiredVersion → force update
 *   - If current < latestVersion → optional update
 */
export async function getAppVersion(req: Request, res: Response) {
  const app = (req.query.app as string)?.toLowerCase() || "radix";
  const config = APP_VERSION_CONFIG[app];
  if (!config) {
    return res.status(400).json({ success: false, message: "Invalid app. Use app=radix or app=serwise" });
  }
  const result = new ApiSuccess(200, "OK", config);
  return res.status(result.statusCode).json(result);
}

/**
 * GET /config/serwise
 * Returns configuration for Serwise app.
 */
export async function getSerwiseConfig(req: Request, res: Response) {
  const config = {
    backendUrl: process.env.BACKEND_URL,
    strapiUrl: process.env.STRAPI_API_URL,
    strapiToken: process.env.STRAPI_API_TOKEN,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    firebase: {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MESUREMENTID,
    },
    mapMyIndia: {
      restApiKey: process.env.MAPMYINDIA_REST_API_KEY,
      mapSdkKey: process.env.MAPMYINDIA_MAP_SDK_KEY,
      clientId: process.env.MAPMYINDIA_CLIENT_ID,
      clientSecret: process.env.MAPMYINDIA_CLIENT_SECRET,
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  };
  const result = new ApiSuccess(200, "OK", config);
  return res.status(result.statusCode).json(result);
}

/**
 * GET /config/radix
 * Returns configuration for Radix app.
 */
export async function getRadixConfig(req: Request, res: Response) {
  const config = {
    backendUrl: process.env.BACKEND_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    strapiUrl: process.env.STRAPI_API_URL,
    strapiToken: process.env.STRAPI_API_TOKEN,
    mapMyIndia: {
      restApiKey: process.env.MAPMYINDIA_REST_API_KEY,
      mapSdkKey: process.env.MAPMYINDIA_MAP_SDK_KEY,
      clientId: process.env.MAPMYINDIA_CLIENT_ID,
      clientSecret: process.env.MAPMYINDIA_CLIENT_SECRET,
    },
  };
  const result = new ApiSuccess(200, "OK", config);
  return res.status(result.statusCode).json(result);
}
