/**
 * Migration Script: Complaint Stage Enum Update
 *
 * This script updates existing complaint documents from lowercase stage values
 * to uppercase values:
 * - "Entrance" -> "ENTRANCE"
 * - "Estimation" -> "ESTIMATION"
 * - "Approval" -> "APPROVAL"
 * - "Payment" -> "PAYMENT"
 *
 * Run this script with: npx ts-node scripts/migrate-complaint-stages.ts
 */

import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { ComplaintModel } from "../src/models/schema/Complaint.schema";

const MONGO_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/servicesmith";

// Stage mapping: old (lowercase) -> new (uppercase)
const stageMapping: Record<string, string> = {
    Entrance: "ENTRANCE",
    Estimation: "ESTIMATION",
    Approval: "APPROVAL",
    Payment: "PAYMENT",
};

async function migrateComplaintStages(): Promise<void> {
    console.log("🚀 Starting complaint stage migration...\n");

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get all complaints with old stage values
        const complaints = await ComplaintModel.find({
            stage: { $in: Object.keys(stageMapping) },
        });

        console.log(`📋 Found ${complaints.length} complaints to migrate\n`);

        if (complaints.length === 0) {
            console.log("✅ No complaints need migration. All stages are already updated.\n");
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const complaint of complaints) {
            const oldStage = complaint.stage as string;
            const newStage = stageMapping[oldStage];

            if (!newStage) {
                console.log(`⚠️  Skipping complaint ${complaint._id}: Unknown stage "${oldStage}"`);
                continue;
            }

            try {
                await ComplaintModel.updateOne(
                    { _id: complaint._id },
                    { $set: { stage: newStage } }
                );
                successCount++;
                console.log(`✅ Migrated complaint ${complaint._id}: ${oldStage} -> ${newStage}`);
            } catch (err) {
                errorCount++;
                console.error(`❌ Failed to migrate complaint ${complaint._id}:`, err);
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 Migration Summary:");
        console.log(`   ✅ Successfully migrated: ${successCount}`);
        console.log(`   ❌ Failed: ${errorCount}`);
        console.log("=".repeat(50) + "\n");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

// Also migrate field names: address -> addressId, parent -> parentId, device -> deviceId
async function migrateFieldNames(): Promise<void> {
    console.log("🚀 Starting field name migration...\n");

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not established");
        }

        // Rename 'address' to 'addressId'
        const addressResult = await db.collection("complaints").updateMany(
            { address: { $exists: true }, addressId: { $exists: false } },
            { $rename: { address: "addressId" } }
        );
        console.log(`✅ Renamed 'address' -> 'addressId': ${addressResult.modifiedCount} documents`);

        // Rename 'parent' to 'parentId'
        const parentResult = await db.collection("complaints").updateMany(
            { parent: { $exists: true }, parentId: { $exists: false } },
            { $rename: { parent: "parentId" } }
        );
        console.log(`✅ Renamed 'parent' -> 'parentId': ${parentResult.modifiedCount} documents`);

        // Rename 'device' to 'deviceId'
        const deviceResult = await db.collection("complaints").updateMany(
            { device: { $exists: true }, deviceId: { $exists: false } },
            { $rename: { device: "deviceId" } }
        );
        console.log(`✅ Renamed 'device' -> 'deviceId': ${deviceResult.modifiedCount} documents`);

        // Rename 'deviceType' to 'deviceTypeId' (convert ObjectId to string if needed)
        const deviceTypeResult = await db.collection("complaints").updateMany(
            { deviceType: { $exists: true }, deviceTypeId: { $exists: false } },
            { $rename: { deviceType: "deviceTypeId" } }
        );
        console.log(`✅ Renamed 'deviceType' -> 'deviceTypeId': ${deviceTypeResult.modifiedCount} documents`);

        // Add default values for new fields
        const defaultsResult = await db.collection("complaints").updateMany(
            { notes: { $exists: false } },
            {
                $set: {
                    notes: "",
                    media: [],
                    subscriptionId: null,
                    payment: null,
                },
            }
        );
        console.log(`✅ Added default values for new fields: ${defaultsResult.modifiedCount} documents`);

        console.log("\n✅ Field name migration complete!\n");
    } catch (error) {
        console.error("❌ Field name migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

// Run migrations
async function main(): Promise<void> {
    console.log("\n" + "=".repeat(60));
    console.log("       COMPLAINT DATA MIGRATION SCRIPT");
    console.log("=".repeat(60) + "\n");

    await migrateComplaintStages();
    console.log("\n");
    await migrateFieldNames();

    console.log("\n🎉 All migrations completed successfully!\n");
}

main().catch(console.error);
