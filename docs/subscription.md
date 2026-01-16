# Subscription Module

Base URL: `/api/v2/subscription`

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

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/subscription \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "A3",
    "created_at": "2023-01-01T00:00:00.000Z",
    "end_at": "2024-01-01T00:00:00.000Z",
    "remaining_service": 3,
    "payment_remaining": 0,
    "auto_renew": true
  }'
```

### Get All Subscriptions
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/subscription
```

### Get Subscription by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/subscription/<SUBSCRIPTION_ID>
```

### Update subscription State
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
