"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Complaint_schema_1 = require("./models/schema/Complaint.schema");
const UserSubscription_schema_1 = require("./models/schema/UserSubscription.schema");
const paymentCalculation_service_1 = require("./services/paymentCalculation.service");
const Quote_schema_1 = require("./models/schema/Quote.schema");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function verify() {
    await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicesmith');
    console.log("Connected to MongoDB.");
    // Create a mock subscription
    const mockSub = await UserSubscription_schema_1.UserSubscriptionModel.create({
        user: new mongoose_1.default.Types.ObjectId(), // Kept original user ID generation as 'user.id' is undefined here
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 86400000 * 30), // 30 days
        plan_snapshot: {
            plan_type: "NORMAL_PLAN",
            totalServices: 5,
            prices: {
                MONTHLY_3: 1500,
            },
            serviceMapping: [
                {
                    category: "Parts",
                    services: [
                        { documentId: "part1", name: "Filter", price: 500 }
                    ]
                }
            ],
            // The following fields were duplicated in the instruction, retaining the original structure for plan_snapshot
            pricing: { cost: 1000, sub_sales: 1500, non_sub_sales: 2000, sub_profit: 500, non_sub_profit: 1000 },
            maxDiscount: 0,
            lockInPeriod: 0,
            validityDuration: 1
        },
        status: 'active',
        paymentModel: 'flat',
        remainingAmount: 0
    });
    console.log("Mock Subscription Created:", mockSub._id);
    // Create mock quote
    const quote = await Quote_schema_1.QuoteModel.create({
        items: ['str_part_1', 'str_part_2'],
        total: 500, // Rs 500 for extra service
        status: 'APPROVED'
    });
    // Create mock complaint
    const complaint = await Complaint_schema_1.ComplaintModel.create({
        user: new mongoose_1.default.Types.ObjectId(),
        provider: new mongoose_1.default.Types.ObjectId(),
        address: new mongoose_1.default.Types.ObjectId(),
        deviceType: "device_type_1",
        stage: "PAYMENT",
        subscriptionId: mockSub._id,
        quote: quote._id
    });
    console.log("Mock Complaint Created:", complaint._id);
    try {
        console.log("Calculating payment amount...");
        const total = await paymentCalculation_service_1.default.calculatePaymentAmount(complaint._id.toString());
        console.log("Payment Calculated:", total);
        const updatedComplaint = await Complaint_schema_1.ComplaintModel.findById(complaint._id);
        console.log("EMI Applied Saved:", updatedComplaint?.emiApplied);
        console.log("Provider Cut Saved:", updatedComplaint?.providerCut);
        // Assertions
        if (total === 700) { // 500 quote + 200 emi (800 / 4)
            console.log("✅ Verification SUCCESS: Total = 700");
        }
        else {
            console.error("❌ Verification FAILED: Expected 700, got", total);
        }
    }
    catch (err) {
        console.error("Test Error:", err);
    }
    finally {
        await Complaint_schema_1.ComplaintModel.deleteOne({ _id: complaint._id });
        await UserSubscription_schema_1.UserSubscriptionModel.deleteOne({ _id: mockSub._id });
        await Quote_schema_1.QuoteModel.deleteOne({ _id: quote._id });
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
}
verify();
//# sourceMappingURL=test_emi.js.map