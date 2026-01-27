# Self Module

Base URL: `/api/v2/me`

## Endpoints

### Get Home Stats
`GET /home`

Returns essential user data for the home screen, including name, unseen notification count, and wallet balance.

**Headers:**
- `Authorization: Bearer <TOKEN>`

**Response:**
```json
{
  "statusCode": 200,
  "message": "Home details fetched successfully",
  "data": {
    "name": "Monil",
    "notifications": 4,
    "wallet": 300
  }
}
```

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
