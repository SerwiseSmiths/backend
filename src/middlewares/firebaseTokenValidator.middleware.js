"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_config_1 = require("../config/firebase.config");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const firebaseTokenVlaidatore = async (req, res, next) => {
    try {
        //retrive token from header
        const authHeader = req.header.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ").length !== 2) {
            throw new ApiError_api_util_1.default(401, "Verify Mobile no to continue.", !authHeader ? "Authorization header required" : "Invalid Authorization header.");
        }
        const idToken = authHeader.split(" ")[1];
        //verify token
        const decodedToken = await firebase_config_1.default.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        console.log("FireBase Mob. no. validation failed : " + err);
        throw new ApiError_api_util_1.default(401, "Verify Mobile no to continue.", err);
    }
};
exports.default = firebaseTokenVlaidatore;
//# sourceMappingURL=firebaseTokenValidator.middleware.js.map