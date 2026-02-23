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

### Generate OTP
`POST /otp/generate`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `phoneNo` (string, required): User phone number

**Notes:**
- Generates a 6-digit OTP with a time-to-live (TTL) of 10 minutes.
- OTP is sent via the configured provider; currently it is logged in the server console.

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/auth/otp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNo": "9876543210"
  }'
```

### Verify OTP and Login
`POST /otp/verify`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `phoneNo` (string, required): User phone number used in OTP generation
- `otp` (string, required): 6-digit OTP received by the user
- `userType` (string, optional): User type, defaults to `customer` when omitted
 - `flow` (string, optional): `"login"` or `"signup"`. Defaults to `"login"`.

**Behavior (login flow):**
- When `flow` is omitted or set to `"login"`:
  - Validates that the OTP matches the latest unconsumed OTP for the phone number.
  - Ensures the OTP is not expired (10-minute TTL) and within the allowed attempt limit.
  - On success, performs the same login flow as `POST /login` (including auto-registration for new users) and returns tokens and user data.

**Behavior (signup flow):**
- When `flow` is `"signup"`:
  - Validates OTP as above.
  - Does not create a user or issue auth tokens.
  - Returns a short-lived `verificationSignature` JWT bound to the verified `phoneNo` and `flow: "signup"`.
  - This signature must be sent in the user registration request.

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNo": "9876543210",
    "otp": "123456",
    "flow": "login"
  }'
```

**cURL (Signup flow example):**
```bash
curl -X POST http://localhost:3000/api/v2/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNo": "9876543210",
    "otp": "123456",
    "flow": "signup"
  }'
```

Successful response (signup flow) includes:

```json
{
  "statusCode": 200,
  "message": "Phone verified for signup",
  "data": {
    "phoneNo": "9876543210",
    "verificationSignature": "<jwt-token>"
  }
}
```
