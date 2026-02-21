# Payment Module

Base URL: `/api/v2/payment`

## Payment Flow for Complaints

### 1. User initiates UPI payment via deeplink

The Serwise app opens any UPI app with pre-filled payment details:
- UPI ID: Admin's UPI address (from env)
- Amount: Quote total
- Transaction note: Complaint ID

**UPI Deeplink Format:**
```
upi://pay?pa=<UPI_ID>&pn=<PAYEE_NAME>&am=<AMOUNT>&cu=INR&tn=<TRANSACTION_NOTE>
```

### 2. User completes payment in UPI app

User makes the payment through their preferred UPI app (Google Pay, PhonePe, Paytm, etc.)

### 3. User requests verification

After payment, user clicks "I have paid" button in Serwise app.

**Endpoint:** `POST /api/v2/payment/request-verification`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `complaintId` (string, required): ID of the complaint being paid for

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/payment/request-verification \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "complaintId": "65f8a1b2c3d4e5f6g7h8i9j0"
  }'
```

### 4. Admin receives verification email

Email contains:
- Complaint ID
- Customer name
- Amount
- UPI address
- **VERIFY PAYMENT** button (success link)
- **REJECT REQUEST** button (reject link)

### 5. Admin clicks verification link

**Success:** `GET /api/v2/payment/verify/:token`
- Marks complaint as COMPLETED
- Sets `paymentVerificationStatus` to "verified"
- Notifies customer via WebSocket

**Reject:** `GET /api/v2/payment/reject/:token`
- Keeps complaint in PAYMENT stage
- Sets `paymentVerificationStatus` to "rejected"
- Notifies customer to retry payment via WebSocket

## Environment Variables Required

```env
PAYMENT_VERIFICATION_EMAIL=admin@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
UPI_PAYMENT_ADDRESS=yourname@upi
BACKEND_URL=http://localhost:3000
```
