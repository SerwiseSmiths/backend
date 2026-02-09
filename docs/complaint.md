# Complaint Module

Base URL: `/api/v2/complaint`

## Overview

The Complaint module handles service requests from users. Complaints track the lifecycle from initial request through completion, including provider assignment, quotes, payments, and status updates.

## Data Model

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Title of the complaint |
| `user` | ObjectId | Reference to User (auto-set from auth) |
| `provider` | ObjectId | Reference to provider User (auto-assigned) |
| `addressId` | ObjectId | Reference to Address |
| `stage` | enum | Status: ENTRANCE, ESTIMATION, APPROVAL, PAYMENT, COMPLETED, REJECTED |
| `parentId` | ObjectId | Reference to parent Complaint (for reopening) |
| `quote` | ObjectId | Reference to Quote |
| `deviceId` | ObjectId | Reference to Device (added by provider) |
| `deviceTypeId` | string | Strapi CMS ID for device type |
| `notes` | string | Additional notes |
| `media` | array | Array of `{ publicUrl, type }` |
| `subscriptionId` | ObjectId | Reference to Subscription |
| `payment` | ObjectId | Reference to WalletLedger |

## Endpoints

### Create Complaint
`POST /`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `title` (string, required)
- `addressId` (string, ObjectId, required)
- `deviceTypeId` (string, optional): Strapi CMS device type ID
- `notes` (string, optional)
- `media` (array, optional): `[{ publicUrl: string, type: string }]`
- `parentId` (string, ObjectId, optional): For reopening complaints
- `subscriptionId` (string, ObjectId, optional)

> [!NOTE]
> `user` is automatically set from the authenticated user.
> `provider` is auto-assigned by the system.
> `stage` defaults to "ENTRANCE".

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/complaint \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling",
    "addressId": "<ADDRESS_ID>",
    "deviceTypeId": "12",
    "notes": "Unit making loud noise",
    "media": [{"publicUrl": "https://example.com/image.jpg", "type": "image/jpeg"}]
  }'
```

---

### List All Complaints
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint
```

---

### List My Complaints
`GET /my`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint/my \
  -H "Authorization: Bearer <TOKEN>"
```

---

### List Provider Complaints
`GET /provider`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint/provider \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Get Complaint by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>
```

---

### Update Complaint
`PUT /:id`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `title` (string, optional)
- `addressId` (ObjectId, optional)
- `deviceTypeId` (string, optional)
- `notes` (string, optional)
- `media` (array, optional)

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/complaint/<COMPLAINT_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling - Urgent",
    "notes": "Updated notes"
  }'
```

---

### Delete Complaint
`DELETE /:id`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/complaint/<COMPLAINT_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Update Stage
`PATCH /:id/stage`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `stage` (string): "ENTRANCE", "ESTIMATION", "APPROVAL", "PAYMENT", "COMPLETED", "REJECTED"

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/stage \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "ESTIMATION"
  }'
```

---

### Add Quote
`PATCH /:id/quote`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `quoteId` (string, ObjectId)

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/quote \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "<QUOTE_ID>"
  }'
```

---

### Add Device
`PATCH /:id/device`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `deviceId` (string, ObjectId)

> [!NOTE]
> Device is typically added by the provider, not the user.

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/device \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "<DEVICE_ID>"
  }'
```

---

### Add Payment
`PATCH /:id/payment`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `paymentId` (string, ObjectId): WalletLedger ID

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/payment \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "<WALLET_LEDGER_ID>"
  }'
```

---

### Reopen Complaint
`POST /:id/reopen`

Creates a new complaint with reference to the parent complaint.

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- Same as Create Complaint (parentId is auto-set)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/complaint/<PARENT_COMPLAINT_ID>/reopen \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Still Not Cooling",
    "addressId": "<ADDRESS_ID>",
    "notes": "Issue persists after previous fix"
  }'
```

---

## WebSocket Events

See [websocket.md](./websocket.md) for real-time complaint events.
