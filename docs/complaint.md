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
- `provider` (string, ObjectId, required): ID of the service provider (User)
- `address` (string, ObjectId, required): ID of the address
- `device` (string, ObjectId, optional): ID of the device if applicable
- `parent` (string, ObjectId, optional): ID of parent complaint
- `quote` (string, ObjectId, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/complaint \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling",
    "provider": "<PROVIDER_USER_ID>",
    "address": "<ADDRESS_ID>",
    "device": "<DEVICE_ID>"
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
    "quote": "<QUOTE_ID>"
  }'
```
