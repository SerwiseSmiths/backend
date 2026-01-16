# Service Module

Base URL: `/api/v2/service`

## Endpoints

### Create Service
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `name` (string, required)
- `price` (number, required)
- `title` (string, required)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/service \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AcService",
    "price": 500,
    "title": "AC Master Service"
  }'
```

### List Services
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/service
```

### Get Service by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/service/<SERVICE_ID>
```

### Update Service
`PATCH /:id`

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/service/<SERVICE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "price": 600
  }'
```

### Delete Service
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/service/<SERVICE_ID>
```
