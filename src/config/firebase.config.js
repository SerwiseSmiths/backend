"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcm = exports.firebaseConfig = void 0;
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();
let fcm = null;
exports.fcm = fcm;
let firebaseApp = null;
// Firebase Client Config (for reference/export if needed)
// Values can be set via environment variables or hardcoded here
exports.firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAVV5-wvpUhNV_hotwLk-39s4dYRFbbS3g",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "servicesmith-de08c.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "servicesmith-de08c",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "servicesmith-de08c.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "805365673790",
    appId: process.env.FIREBASE_APP_ID || "1:805365673790:web:6c6f51551341d6f3ee066f",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-PYP8EKXG6X"
};
// Try to load serviceAccountKey.json if available
let serviceAccount;
let serviceAccountPath = null;
try {
    // Prefer explicit path, then GOOGLE_APPLICATION_CREDENTIALS, then default location
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    }
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }
    else {
        serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
    }
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        console.log(`[Firebase] Loading service account from: ${serviceAccountPath}`);
        serviceAccount = require(serviceAccountPath);
        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
            console.error("[Firebase] Service account file is missing required fields (project_id, private_key, client_email)");
            serviceAccount = null;
        }
        else {
            console.log(`[Firebase] Service account loaded successfully for project: ${serviceAccount.project_id}`);
        }
    }
    else {
        console.warn(`[Firebase] Service account file not found at: ${serviceAccountPath}`);
    }
}
catch (error) {
    console.error("[Firebase] Error loading service account:", error.message);
    serviceAccount = null;
}
// Try to get project ID from environment variables or service account
const projectId = exports.firebaseConfig.projectId ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    serviceAccount?.project_id;
// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        if (serviceAccount) {
            // Initialize with service account credentials
            try {
                firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: serviceAccount.project_id,
                        privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n'),
                        clientEmail: serviceAccount.client_email
                    }),
                    projectId: projectId || serviceAccount.project_id
                });
                console.log(`[Firebase] Admin Initialized with Service Account (Project: ${serviceAccount.project_id})`);
            }
            catch (certError) {
                console.error("[Firebase] Error creating credential from service account:", certError.message);
                throw certError;
            }
        }
        else if (projectId) {
            // Initialize with project ID only (limited functionality - won't work for FCM)
            console.warn(`[Firebase] Initializing with Project ID only (${projectId}) - FCM will NOT work without credentials`);
            firebaseApp = admin.initializeApp({
                projectId: projectId
            });
            console.log(`[Firebase] Admin Initialized with Project ID: ${projectId}`);
            console.warn("[Firebase] WARNING: No credentials provided. FCM will fail with 'invalid-credential' error.");
        }
        else {
            console.warn("[Firebase] WARNING: Firebase Admin not initialized. Missing service account or project ID.");
            console.warn("[Firebase] To fix this, provide one of the following:");
            console.warn("  1. FIREBASE_SERVICE_ACCOUNT_PATH — full path to service account JSON file");
            console.warn("  2. GOOGLE_APPLICATION_CREDENTIALS — full path to service account JSON file");
            console.warn("  3. serviceAccountKey.json in the backend project root (services/backend/)");
            console.warn("  4. FIREBASE_PROJECT_ID (limited; FCM still needs a service account file)");
            console.warn("");
            console.warn("[Firebase] Note: For FCM to work, you MUST provide a service account key file.");
            console.warn("[Firebase] The client-side Firebase config (apiKey, authDomain, etc.) is not sufficient for Admin SDK.");
        }
    }
    catch (error) {
        console.error("[Firebase] Error initializing Firebase Admin:", error.message);
        console.error("[Firebase] Stack:", error.stack);
        console.warn("[Firebase] FCM will not be available. Push notifications will fail.");
        firebaseApp = null;
    }
}
else {
    firebaseApp = admin.app();
    console.log("[Firebase] Using existing Firebase Admin app instance");
}
// Initialize FCM only if Firebase is properly initialized
if (firebaseApp) {
    try {
        exports.fcm = fcm = admin.messaging(firebaseApp);
    }
    catch (error) {
        console.error("Error initializing FCM:", error.message);
        exports.fcm = fcm = null;
    }
}
exports.default = admin;
//# sourceMappingURL=firebase.config.js.map