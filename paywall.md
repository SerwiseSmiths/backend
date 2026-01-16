# Paywall Integration Guide (Razorpay)

This guide explains how to implement the generic Paywall for **Wallet Recharge**, **Order Payments**, **Subscriptions**, and **Complaint Payments** using Razorpay.

## Overview
We use a unified flow:
1.  **Frontend** requests backend to create an order (`/api/v2/payment/create-order`).
2.  **Backend** returns Razorpay `order_id`.
3.  **Frontend** opens Razorpay Checkout using this `order_id`.
4.  **Frontend** sends the success response (signature) to backend for verification (`/api/v2/payment/verify`).
5.  **Backend** verifies signature and executes logic (e.g., Credit Wallet).

## Endpoints

### 1. Create Order
Call this when user clicks "Pay" or "Recharge".

- **URL:** `/api/v2/payment/create-order`
- **Method:** `POST`
- **Auth:** Required

**Body:**
```json
{
  "amount": 100,      // Amount in INR (e.g., 100)
  "type": "wallet_recharge", // Options: "wallet_recharge", "order_payment", "subscription", "complaint"
  "subscriptionId": "sub_123", // Required if type is "subscription"
  "complaintId": "comp_123"    // Required if type is "complaint"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "id": "order_P7s8s9s8s7s", // use this as order_id in razorpay options
    "amount": 10000,
    "currency": "INR",
    "notes": { ... }
  },
  "success": true
}
```

### 2. Verify Payment
Call this immediately after Razorpay success callback.

- **URL:** `/api/v2/payment/verify`
- **Method:** `POST`
- **Auth:** Required

**Body:**
```json
{
  "razorpay_order_id": "order_P7s8s9s8s7s",
  "razorpay_payment_id": "pay_S8s7s7s7s7s",
  "razorpay_signature": "e8s7s7s..."
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Payment verified successfully",
  "success": true
}
```

## Frontend Implementation (React Native / Web)

### Step 1: Install Razorpay SDK
- **Web:** Load script `https://checkout.razorpay.com/v1/checkout.js`
- **React Native:** `react-native-razorpay`

### Step 2: Code Example

```javascript
// 1. Create Order on Backend
const createRes = await axios.post('/api/v2/payment/create-order', {
  amount: 500,
  amount: 500,
  type: 'wallet_recharge' // or 'subscription', 'complaint' (send subscriptionId/complaintId accordingly)
}, { headers: { Authorization: token } });

const { id: order_id, amount, currency } = createRes.data.data;

// 2. Open Razorpay
const options = {
  description: 'Wallet Recharge',
  image: 'https://your-logo-url',
  currency: currency,
  key: 'YOUR_RAZORPAY_KEY_ID', // From public config
  amount: amount, // in paise
  name: 'ServiceSmith',
  order_id: order_id, 
  prefill: {
    email: 'user@example.com',
    contact: '9999999999',
    name: 'User Name'
  },
  theme: { color: '#53a20e' }
}

RazorpayCheckout.open(options).then(async (data) => {
  // handle success
  console.log(`Success: ${data.razorpay_payment_id}`);
  
  // 3. Verify on Backend
  const verifyRes = await axios.post('/api/v2/payment/verify', {
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    razorpay_signature: data.razorpay_signature
  }, { headers: { Authorization: token } });

  alert('Payment Successful!');

}).catch((error) => {
  // handle failure
  alert(`Error: ${error.code} | ${error.description}`);
});
```
