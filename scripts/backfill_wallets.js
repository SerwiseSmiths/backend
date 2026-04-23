"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const mongo_config_1 = require("../src/config/mongo.config");
const User_schema_1 = require("../src/models/schema/User.schema");
const Wallet_schema_1 = require("../src/models/schema/Wallet.schema");
const backfillWallets = async () => {
    try {
        await (0, mongo_config_1.connectDB)();
        console.log("Connected to DB");
        const users = await User_schema_1.default.find({});
        console.log(`Found ${users.length} users`);
        let createdCount = 0;
        let existingCount = 0;
        for (const user of users) {
            const existingWallet = await Wallet_schema_1.default.findOne({ user: user._id });
            if (existingWallet) {
                existingCount++;
                // console.log(`Wallet already exists for user ${user._id}`);
            }
            else {
                await Wallet_schema_1.default.create({
                    user: user._id,
                    balance: 0,
                });
                createdCount++;
                console.log(`Created wallet for user ${user._id}`);
            }
        }
        console.log(`Backfill complete. Created: ${createdCount}, Existing: ${existingCount}`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error backfilling wallets:", error);
        process.exit(1);
    }
};
backfillWallets();
//# sourceMappingURL=backfill_wallets.js.map