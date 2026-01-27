# Chat Module API Documentation

This document describes the endpoints and WebSocket events for the Chat and Circle functionalities.

## Base URL
`/api/v2/chat` and `/api/v2/circle`

---

## REST Endpoints

### 1. Update Username
After the first login, the user should be prompted to set their own username.
- **URL**: `/api/v2/chat/username`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "newUsername": "john_doe_99"
}
```
- **Response**: `200 OK` with updated user object.

### 2. Get Chat History
- **URL**: `/api/v2/chat/history`
- **Method**: `GET`
- **Auth**: Required
- **Query Params**:
  - `targetId`: ID of the user or circle.
  - `targetType`: `User` or `Circle`.
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "678e5...",
      "sender": { "username": "...", "profileImage": "..." },
      "content": "Hello!",
      "createdAt": "..."
    }
  ]
}
```

### 3. Share Complaint
- **URL**: `/api/v2/chat/share-complaint`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "recipientId": "RECIPIENT_USER_OR_CIRCLE_ID",
  "recipientType": "User",
  "complaintId": "COMPLAINT_ID"
}
```

---

## Circle (Group) Endpoints

### 4. Create Circle
- **URL**: `/api/v2/circle/create`
- **Method**: `POST`
- **Body**: `{ "name": "Family", "description": "Family group" }`

### 5. Join Circle via Link
- **URL**: `/api/v2/circle/join`
- **Method**: `POST`
- **Body**: `{ "invitationCode": "A1B2C3D4" }`

---

## WebSocket Events (Socket.io)

### Connection & Auth
Connect to the server and emit `auth` with your user ID.
```javascript
const socket = io("http://localhost:3000");
socket.emit("auth", "YOUR_USER_ID");
```

### Events to Listen to:
- `message:receive`: Triggered when a new message arrives.
- `call:incoming`: Triggered for an incoming audio/video call.
- `circle:invitation`: Triggered when invited to a circle (online only).

### Events to Emit:
- `message:send`: `{ senderId, recipientType, recipientId, content, type, complaintId? }`
- `call:initiate`: `{ callerId, recipientId, callType: 'audio'|'video', signalData }`
- `call:respond`: `{ callerId, response: 'accept'|'reject', signalData? }`

---

## cURL Examples

### Create Circle
```bash
curl -X POST http://localhost:3000/api/v2/circle/create \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"name": "Engineers", "description": "Tech talk"}'
```
