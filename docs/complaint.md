# Complaint Module

Base URL: `/api/v2/complaint`

## Endpoints

### Create Complaint
`POST /`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `title` (string, required)
- `address` (string, ObjectId, required): ID of the address
- `deviceType` (string, ObjectId, required): ID of the device type
- `parent` (string, ObjectId, optional): ID of parent complaint
- `quote` (string, ObjectId, optional)

> [!NOTE]
> `device` ID is not taken during creation. It is added afterwards by the provider or through the update device endpoint.

> [!NOTE]
> **Provider is auto-assigned.** The system automatically assigns an available provider when the complaint is created. You do not need to (and cannot) specify a provider.

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/complaint \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling",
    "address": "<ADDRESS_ID>",
    "deviceType": "Air Conditioner"
  }'
```

### List Complaints
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint
```

### Get Complaint by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>
```

### Update Complaint
`PUT /:id`

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/complaint/<COMPLAINT_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling - Urgent"
  }'
```

### Delete Complaint
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>
```

### Update Stage
`PATCH /:id/stage`

**Body Parameters:**
- `stage` (string): "Entrance", "Estimation", "Approval", "Payment"

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/stage \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Estimation"
  }'
```

### Add Quote
`PATCH /:id/quote`

**Body Parameters:**
- `quote` (string, ObjectId)

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/quote \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "<QUOTE_ID>"
  }'
```

### Add Device
`PATCH /:id/device`

**Body Parameters:**
- `deviceId` (string, ObjectId)

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/complaint/<COMPLAINT_ID>/device \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "<DEVICE_ID>"
  }'
```
