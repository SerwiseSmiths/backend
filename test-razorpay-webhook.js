const crypto = require("crypto");
const http = require("http");

// Replace with the test signature/secret you set in your `.env` (DEV_RAZORPAY_WEBHOOK_SECRET)
// If you don't have one set, the controller will skip signature verification but still process.
const WEBHOOK_SECRET = "test_secret_123";

// Generate a fake paymentRef
const paymentRef = `PAY-C-${Date.now()}`;
// const walletPaymentRef = `PAY-W-64f1b2c3d4e5f6a7b8c9d0e1-${Date.now()}`; // Example for wallet

const payload = {
    event: "payment.captured",
    payload: {
        payment: {
            entity: {
                id: "pay_xyz123",
                amount: 20000, // 200 rupees
                currency: "INR",
                notes: {
                    comment: paymentRef
                }
            }
        }
    }
};

const payloadString = JSON.stringify(payload);

const signature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payloadString)
    .digest("hex");

const options = {
    hostname: "localhost",
    port: 3000, // Ensure your dev server is running on this port
    path: "/api/v2/payment/razorpay/webhook",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payloadString),
        "x-razorpay-signature": signature
    }
};

console.log("Sending Webhook Simulation for Payment Ref:", paymentRef);

const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response Body: ${data}`);
        
        if (res.statusCode === 200) {
            console.log("✅ Webhook processed successfully!");
        } else {
            console.error("❌ Webhook failed.");
        }
    });
});

req.on("error", (error) => {
    console.error("Error connecting to server:", error.message);
});

req.write(payloadString);
req.end();
