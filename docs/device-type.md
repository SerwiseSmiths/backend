# Device Type Module

Base URL: `/api/v2/device-type`

## Endpoints

### Create Device Type
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `name` (string, required)
- `description` (string, optional)
- `is_deleted` (boolean, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/device-type \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RO Water Purifier",
    "description": "Standard RO Machine"
  }'
```

### List Device Types
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device-type
```

### Get Device Type by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID>
```

### Update Device Type
`PUT /:id`

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RO Water Purifier - Lite"
  }'
```

### Delete Device Type
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID>
```
