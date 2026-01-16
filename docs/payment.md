# Payment Module

Base URL: `/api/v2/payment`

## Endpoints

### Create Payment Order
`POST /create-order`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `amount` (number, required): Amount in currency subunits (e.g. paise for INR)
- `type` (string, required): 'wallet_recharge' or 'order_payment'

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/payment/create-order \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "type": "wallet_recharge"
  }'
```

### Verify Payment
`POST /verify`

Called after Razorpay payment completion on frontend.

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `razorpay_order_id` (string, required)
- `razorpay_payment_id` (string, required)
- `razorpay_signature` (string, required)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/payment/verify \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_Hj...123",
    "razorpay_payment_id": "pay_Hj...456",
    "razorpay_signature": "e5c..."
  }'
```
