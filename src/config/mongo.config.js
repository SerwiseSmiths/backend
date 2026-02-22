"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// config/mongo.config.ts
const mongoose_1 = require("mongoose");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URL, {
        // No need for useNewUrlParser, useUnifiedTopology in Mongoose 6+
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        const err = error;
        console.error(`❌ MongoDB Error: ${err.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=mongo.config.js.map