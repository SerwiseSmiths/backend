# Quote Module

Base URL: `/api/v2/quote`

## Endpoints

### Create Quote
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `items` (array of strings, required): Array of Service/Item IDs (24 char hex)
- `total` (number, optional): Can be auto-calculated
- `isPaid` (boolean, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/quote \
  -H "Content-Type: application/json" \
  -d '{
    "items": ["60d5ecb8b392d750c82233b1", "60d5ecb8b392d750c82233b2"],
    "isPaid": false
  }'
```

### List Quotes
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/quote
```

### Get Quote by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/quote/<QUOTE_ID>
```

### Update Quote
`PATCH /:id`

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v2/quote/<QUOTE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "isPaid": true
  }'
```

### Delete Quote
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/quote/<QUOTE_ID>
```
