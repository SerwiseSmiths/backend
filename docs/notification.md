# Notification Module

Base URL: `/api/v2/notification`

## Endpoints

### Register Device Token
`POST /device/register`

Register an FCM token for push notifications. Can be called with or without authentication. If authenticated, links token to the user.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <TOKEN>` (Optional but recommended)

**Body Parameters:**
- `token` (string, required): FCM Device Token
- `deviceType` (string, optional): "ANDROID" (default) or "IOS"

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/notification/device/register \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<FCM_TOKEN>",
    "deviceType": "ANDROID"
  }'
```

### Get My Notifications
`GET /my-notifications`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**Query Parameters:**
- `limit` (number, optional, default 20)
- `skip` (number, optional, default 0)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/v2/notification/my-notifications?limit=10&skip=0" \
  -H "Authorization: Bearer <TOKEN>"
```

### Send Notification (Admin)
`POST /send`

**Headers:**
- `Authorization: Bearer <TOKEN>` (Must have 'manager' role)
- `Content-Type: application/json`

**Body Parameters:**
- `title` (string, required)
- `body` (string, required)
- `type` (string, required): e.g., "GENERAL", "PROMOTION"
- `target` (string, required): "INDIVIDUAL", "GROUP", "ALL"
- `userId` (string, optional): Required if target is "INDIVIDUAL"
- `metadata` (object, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/notification/send \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome",
    "body": "Thanks for joining us!",
    "type": "GENERAL",
    "target": "ALL"
  }'
```
