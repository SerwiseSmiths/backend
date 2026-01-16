# Geocode Module

Base URL: `/api/v2/geocode`

## Endpoints

### Get Lat/Lng from Address
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `address` (string, required)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Connaught Place, New Delhi"
  }'
```

**Response:**
Returns latitude, longitude, and formatted address details.
