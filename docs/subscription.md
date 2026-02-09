# Subscription Module

Base URL: `/api/v2/subscription`

## Overview

The Subscription module manages service subscriptions for users, including payment tracking.

## Data Model

| Field | Type | Description |
|-------|------|-------------|
| `user` | ObjectId | Reference to User |
| `created_at` | Date | Subscription start date |
| `end_at` | Date | Subscription end date |
| `remaining_service` | number | Number of services remaining |
| `used_service` | number | Number of services used |
| `state` | enum | active, expired, completed, cancelled, pending |
| `auto_renew` | boolean | Auto-renewal flag |
| `payment_remaining` | number | Amount remaining to be paid |
| `type` | enum | A3, A4, A6, B3, B4, B6, C |
| `payments` | ObjectId[] | Array of WalletLedger references |

---

## Endpoints

### Create Subscription
`POST /`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `type` (string, required): Enum ["A3","A4","A6","B3","B4","B6","C"]
- `created_at` (Date, required)
- `end_at` (Date, required)
- `remaining_service` (number, required)
- `payment_remaining` (number, required)
- `auto_renew` (boolean, optional, default false)
- `payments` (ObjectId[], optional): Initial payment references

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/subscription \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "A3",
    "created_at": "2026-01-27T00:00:00.000Z",
    "end_at": "2027-01-27T00:00:00.000Z",
    "remaining_service": 12,
    "payment_remaining": 0,
    "auto_renew": true,
    "payments": []
  }'
```

---

### Get All Subscriptions
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/subscription
```

---

### Get Subscription by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>
```

---

### Update Subscription State
`PATCH /:id/state`

**Body Parameters:**
- `state` (string, required): Enum ["active", "expired", "completed", "cancelled", "pending"]

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>/state \
  -H "Content-Type: application/json" \
  -d '{
    "state": "active"
  }'
```

---

### Update Payment Remaining
`PATCH /:id/payment`

**Body Parameters:**
- `amount` (number, required)

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>/payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100
  }'
```

---

### Add Payment to Subscription
`PATCH /:id/payments/add`

Adds a WalletLedger reference to the subscription's payments array.

**Body Parameters:**
- `paymentId` (ObjectId, required): WalletLedger ID

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>/payments/add \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "<WALLET_LEDGER_ID>"
  }'
```

---

### Get Subscription Payments
`GET /:id/payments`

Returns the subscription with populated payments.

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>/payments
```

---

## Type Descriptions

| Type | Description |
|------|-------------|
| A3 | Annual - 3 services |
| A4 | Annual - 4 services |
| A6 | Annual - 6 services |
| B3 | Bi-annual - 3 services |
| B4 | Bi-annual - 4 services |
| B6 | Bi-annual - 6 services |
| C | Custom |
