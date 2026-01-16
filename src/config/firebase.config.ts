import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

// Try to load serviceAccountKey.json if available
let serviceAccount: any;
try {
  // Check common locations or use env var path
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  } else {
    // Default fallback
    serviceAccount = require("../../serviceAccountKey.json");
  }
} catch (error) {
  // ignore
}

// Initialize
if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized with Service Account");
  } else {
    // Fallback to default credentials (e.g. Google Cloud Environment)
    // or existing env vars if they work for Admin SDK (unlikely for full features without creds)
    admin.initializeApp();
    console.log("Firebase Admin Initialized with Default Credentials");
  }
}

export const fcm = admin.messaging();
export default admin;
