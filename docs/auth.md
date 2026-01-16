# Auth Module

Base URL: `/api/v2/auth`

## Endpoints

### Login
`POST /login`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `phoneNo` (string, required): User phone number

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNo": "9876543210"
  }'
```

**Response:**
Returns an object containing the `token` which should be used in the `Authorization` header for protected routes.
