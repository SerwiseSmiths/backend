import mongoose from 'mongoose';
import { ComplaintModel } from 'd:/ServiceSmith/services/backend/src/models/schema/Complaint.schema';
import { UserSubscriptionModel } from 'd:/ServiceSmith/services/backend/src/models/schema/UserSubscription.schema';
import paymentCalculationService from 'd:/ServiceSmith/services/backend/src/services/paymentCalculation.service';
import { ServiceModel } from 'd:/ServiceSmith/services/backend/src/models/schema/Service.schema';
import { QuoteModel } from 'd:/ServiceSmith/services/backend/src/models/schema/Quote.schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'd:/ServiceSmith/services/backend/.env' });

async function verify() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicesmith');
    console.log("Connected to MongoDB.");

    // Create a mock subscription
    const mockSub = await UserSubscriptionModel.create({
        user: new mongoose.Types.ObjectId(), // Kept original user ID generation as 'user.id' is undefined here
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
    const quote = await QuoteModel.create({
        items: ['str_part_1', 'str_part_2'],
        total: 500, // Rs 500 for extra service
        status: 'APPROVED'
    });
    
    // Create mock complaint
    const complaint = await ComplaintModel.create({
        user: new mongoose.Types.ObjectId(),
        provider: new mongoose.Types.ObjectId(),
        address: new mongoose.Types.ObjectId(),
        deviceType: "device_type_1",
        stage: "PAYMENT",
        subscriptionId: mockSub._id,
        quote: quote._id
    });
    console.log("Mock Complaint Created:", complaint._id);

    try {
        console.log("Calculating payment amount...");
        const total = await paymentCalculationService.calculatePaymentAmount(complaint._id.toString());
        
        console.log("Payment Calculated:", total);
        
        const updatedComplaint = await ComplaintModel.findById(complaint._id);
        console.log("EMI Applied Saved:", updatedComplaint?.emiApplied);
        console.log("Provider Cut Saved:", updatedComplaint?.providerCut);
        
        // Assertions
        if (total === 700) { // 500 quote + 200 emi (800 / 4)
            console.log("✅ Verification SUCCESS: Total = 700");
        } else {
            console.error("❌ Verification FAILED: Expected 700, got", total);
        }
    } catch(err) {
        console.error("Test Error:", err);
    } finally {
        await ComplaintModel.deleteOne({ _id: complaint._id });
        await UserSubscriptionModel.deleteOne({ _id: mockSub._id });
        await QuoteModel.deleteOne({ _id: quote._id });
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
