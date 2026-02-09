# WebSocket Events

## Overview

The backend uses Socket.IO for real-time communication. WebSocket events enable instant updates for complaints, payments, messages, and calls.

## Connection

**URL:** `ws://localhost:3000` (or your server URL)

**Authentication:**
After connecting, emit the `auth` event with your user ID to register:

```javascript
socket.emit("auth", userId);
```

---

## Complaint Events

### complaint:created
Emitted when a new complaint is created.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "userId": "user_id",
  "providerId": "provider_id",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:quote_added
Emitted when a provider adds a quote to a complaint.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "quote": { /* quote object */ },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:stage_changed
Emitted when the complaint stage/status changes.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "oldStage": "ENTRANCE",
  "newStage": "ESTIMATION",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:payment_done
Emitted when payment is completed for a complaint.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "payment": { /* payment/wallet ledger object */ },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:provider_assigned
Emitted when a provider is assigned to a complaint.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "provider": "provider_id",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:updated
Emitted when a complaint is updated.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "changes": { /* optional: changed fields */ },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:completed
Emitted when a complaint is marked as COMPLETED.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "oldStage": "PAYMENT",
  "newStage": "COMPLETED",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

### complaint:rejected
Emitted when a complaint is REJECTED.

**Payload:**
```json
{
  "complaint": { /* complaint object */ },
  "oldStage": "ENTRANCE",
  "newStage": "REJECTED",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

## Messaging Events

### message:send (Client → Server)
Send a message to a user or circle.

**Payload:**
```json
{
  "senderId": "user_id",
  "recipientType": "User" | "Circle",
  "recipientId": "recipient_id",
  "content": "Hello!",
  "type": "text",
  "complaintId": "optional_complaint_id"
}
```

---

### message:receive (Server → Client)
Receive a message.

**Payload:**
```json
{
  "sender": "sender_id",
  "recipientType": "User",
  "recipientId": "user_id",
  "content": "Hello!",
  "type": "text",
  "_id": "message_id",
  "createdAt": "2026-01-27T10:00:00.000Z"
}
```

---

## Call Events

### call:initiate (Client → Server)
Initiate a call.

**Payload:**
```json
{
  "callerId": "caller_id",
  "recipientId": "recipient_id",
  "callType": "audio" | "video",
  "signalData": { /* WebRTC signal data */ }
}
```

---

### call:incoming (Server → Client)
Receive an incoming call notification.

**Payload:**
```json
{
  "callerId": "caller_id",
  "callType": "audio",
  "signalData": { /* WebRTC signal data */ }
}
```

---

### call:respond (Client → Server)
Respond to a call.

**Payload:**
```json
{
  "callerId": "caller_id",
  "response": "accept" | "reject",
  "signalData": { /* WebRTC signal data */ }
}
```

---

### call:answered (Server → Client)
Call response received.

**Payload:**
```json
{
  "response": "accept",
  "signalData": { /* WebRTC signal data */ }
}
```

---

## Circle Events

### circle:invite (Client → Server)
Invite a user to a circle.

**Payload:**
```json
{
  "senderId": "sender_id",
  "recipientId": "recipient_id",
  "circleId": "circle_id"
}
```

---

### circle:invitation (Server → Client)
Receive a circle invitation.

**Payload:**
```json
{
  "senderId": "sender_id",
  "circleId": "circle_id"
}
```

---

## Offline Handling

When a user is offline:
1. **Users**: Push notifications are sent via FCM
2. **Providers**: Events are queued and delivered when they reconnect

The provider event queue ensures no complaint assignments are missed.

---

## Example: JavaScript Client

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Authenticate
socket.emit("auth", userId);

// Listen for complaint events
socket.on("complaint:created", (data) => {
  console.log("New complaint:", data.complaint);
});

socket.on("complaint:stage_changed", (data) => {
  console.log(`Stage changed: ${data.oldStage} -> ${data.newStage}`);
});

socket.on("complaint:payment_done", (data) => {
  console.log("Payment completed:", data.payment);
});

// Send a message
socket.emit("message:send", {
  senderId: userId,
  recipientType: "User",
  recipientId: recipientId,
  content: "Hello!",
  type: "text"
});
```
