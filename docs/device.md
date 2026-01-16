# Device Module

Base URL: `/api/v2/device`

## Endpoints

### Create Device
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `name` (string, required)
- `deviceType` (string, ObjectId, required)
- `user` (string, ObjectId, required)
- `address` (string, ObjectId, required)
- `description` (object, required):
  - `basic`: { spun, sediment, pre, post, UV, UF, RO, TDS, Alkaline } (all numbers)
  - `additional`: { CU, zn, MG, ca, other } (all numbers)
  - `age` (number)
  - `storageCapacity` (number)
  - `location` (string)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/device \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kitchen RO",
    "deviceType": "<DEVICE_TYPE_ID>",
    "user": "<USER_ID>",
    "address": "<ADDRESS_ID>",
    "description": {
      "basic": { "spun": 1, "sediment": 1, "pre": 1, "post": 1, "UV": 1, "UF": 1, "RO": 1, "TDS": 100, "Alkaline": 1 },
      "additional": { "CU": 0, "zn": 0, "MG": 0, "ca": 0, "other": 0 },
      "age": 2,
      "storageCapacity": 10,
      "location": "Kitchen"
    }
  }'
```

### List Devices
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device
```

### Get Device by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device/<DEVICE_ID>
```

### Update Device
`PUT /:id`

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/device/<DEVICE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kitchen RO Updated"
  }'
```

### Delete Device
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/device/<DEVICE_ID>
```
