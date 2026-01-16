# Address Module

Base URL: `/api/v2/address`

## Endpoints

### Create Address
`POST /`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `title` (string, required): e.g. "Home"
- `house_no` (string, required): e.g. "A-101"
- `society_name` (string, required): e.g. "Galaxy Apartments"
- `pin_code` (string, length 6, required): e.g. "110001"
- `city` (string, required): e.g. "New Delhi"
- `address_line_one` (string, optional)
- `address_line_two` (string, optional)
- `area` (string, optional)
- `state` (string, optional)
- `country` (string, default "India")
- `latitude` (string, optional)
- `longitude` (string, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/address \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Home",
    "house_no": "101",
    "society_name": "Sunrise Heights",
    "city": "Mumbai",
    "pin_code": "400001",
    "state": "Maharashtra"
  }'
```

### Get User Addresses
`GET /`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/address \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Address by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/address/<ADDRESS_ID>
```

### Update Address
`PUT /:id`

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/address/<ADDRESS_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Home Updated",
    "house_no": "102"
  }'
```

### Delete Address
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/address/<ADDRESS_ID>
```
