import * as admin from "firebase-admin";
declare let fcm: admin.messaging.Messaging | null;
export declare const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};
export { fcm };
export default admin;
//# sourceMappingURL=firebase.config.d.ts.map