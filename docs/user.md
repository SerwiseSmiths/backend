# User Module

Base URL: `/api/v2/user`

## Endpoints

### Register User
`POST /`

**Headers:**
- `Content-Type: multipart/form-data` (if uploading image) or `application/json`

**Body Parameters:**
- `verificationSignature` (string, required): JWT from `POST /auth/otp/verify` with `flow="signup"`
- `phoneNo` (string, ignored, 10-15 digits)
- `firstName` (string, required)
- `lastName` (string, required)
- `source` (string, required)
- `email` (string, optional)
- `middleName` (string, optional)
- `userType` (string, optional, default "customer")
- `profileImage` (file, optional)

**cURL (JSON):**
```bash
curl -X POST http://localhost:3000/api/v2/user \
  -H "Content-Type: application/json" \
  -d '{
    "verificationSignature": "<jwt-token-from-otp-verify>",
    "firstName": "John",
    "lastName": "Doe",
    "source": "app_signup",
    "email": "john.doe@example.com"
  }'
```

**cURL (Multipart):**
```bash
curl -X POST http://localhost:3000/api/v2/user \
  -H "Content-Type: multipart/form-data" \
  -F "verificationSignature=<jwt-token-from-otp-verify>" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "source=app_signup" \
  -F "profileImage=@/path/to/image.jpg"
```

### Get All Users
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/user
```

### Validate Referral Code
`GET /refCode/:refCode/verify`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/user/refCode/<REF_CODE>/verify
```
