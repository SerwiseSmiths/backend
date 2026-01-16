import "dotenv/config";
import { connectDB } from "../src/config/mongo.config";
import UserModel from "../src/models/schema/User.schema";
import WalletModel from "../src/models/schema/Wallet.schema";

const backfillWallets = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        const users = await UserModel.find({});
        console.log(`Found ${users.length} users`);

        let createdCount = 0;
        let existingCount = 0;

        for (const user of users) {
            const existingWallet = await WalletModel.findOne({ user: user._id });
            if (existingWallet) {
                existingCount++;
                // console.log(`Wallet already exists for user ${user._id}`);
            } else {
                await WalletModel.create({
                    user: user._id,
                    balance: 0,
                });
                createdCount++;
                console.log(`Created wallet for user ${user._id}`);
            }
        }

        console.log(`Backfill complete. Created: ${createdCount}, Existing: ${existingCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Error backfilling wallets:", error);
        process.exit(1);
    }
};

backfillWallets();
