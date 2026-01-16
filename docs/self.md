# Self Module

Base URL: `/api/v2/me`

## Endpoints

### Get Home Stats
`GET /home`

Returns provider statistics and earnings.

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/me/home \
  -H "Authorization: Bearer <TOKEN>"
```

### Get My Address
`GET /address`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/me/address \
  -H "Authorization: Bearer <TOKEN>"
```

### Get My Devices
`GET /devices`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/me/devices \
  -H "Authorization: Bearer <TOKEN>"
```

### Get My Complaints
`GET /complaints`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/me/complaints \
  -H "Authorization: Bearer <TOKEN>"
```
