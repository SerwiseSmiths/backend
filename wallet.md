# Wallet API Documentation

This document outlines the API endpoints for the User Wallet functionality.

## Base URL
`/api/v2/wallet`

## Authentication
All endpoints require a valid JWT Access Token passed in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <your_access_token>
```

---

## Endpoints

### 1. Get Wallet Details
Retrieves the current user's wallet balance and status.

- **Method:** `GET`
- **URL:** `/`
- **Auth Required:** Yes

#### Response (Success - 200 OK)
```json
{
  "statusCode": 200,
  "message": "Wallet fetched successfully",
  "data": {
    "wallet": {
      "_id": "678123456789abcde1234567",
      "user": "678000000000000000000001",
      "balance": 1500,
      "isActive": true,
      "createdAt": "2026-01-11T10:00:00.000Z",
      "updatedAt": "2026-01-11T12:00:00.000Z",
      "__v": 0
    }
  },
  "success": true
}
```

#### Response (Error - 401 Unauthorized)
```json
{
  "message": "Access Denied: No Token Provided"
}
```

---

### 2. Credit Wallet
Adds funds to the user's wallet. 
> **Note:** This endpoint is typically used by internal services (e.g., after successful payment gateway callback) or admin panels. If used directly from frontend, ensure it is secure or strictly for testing/mock flows.

- **Method:** `POST`
- **URL:** `/credit`
- **Auth Required:** Yes

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `amount` | `number` | Yes | Amount to add (must be > 0). |
| `source` | `string` | Yes | Source of funds. Allowed values: `recharge`, `admin_adjustment`, `cashback`, `refund`. |
| `refId` | `string` | No | Reference ID (e.g., Payment Gateway Transaction ID). |
| `meta` | `object` | No | Any additional metadata (JSON object). |

**Example Request:**
```json
{
  "amount": 500,
  "source": "recharge",
  "refId": "PAY_123456789",
  "meta": {
    "paymentMethod": "UPI",
    "gateway": "Cashfree"
  }
}
```

#### Response (Success - 200 OK)
```json
{
  "statusCode": 200,
  "message": "Wallet credited successfully",
  "data": {
    "wallet": {
      "_id": "678123456789abcde1234567",
      "user": "678000000000000000000001",
      "balance": 2000,
      "isActive": true,
      "createdAt": "2026-01-11T10:00:00.000Z",
      "updatedAt": "2026-01-11T12:05:00.000Z",
      "__v": 0
    }
  },
  "success": true
}
```

---

### 3. Debit Wallet
Deducts funds from the user's wallet. checks for sufficient balance before processing.

- **Method:** `POST`
- **URL:** `/debit`
- **Auth Required:** Yes

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `amount` | `number` | Yes | Amount to deduct (must be > 0). |
| `source` | `string` | Yes | Reason for deduction. Allowed values: `order_payment`. |
| `refId` | `string` | No | Reference ID (e.g., Order ID). |
| `meta` | `object` | No | Any additional metadata. |

**Example Request:**
```json
{
  "amount": 250,
  "source": "order_payment",
  "refId": "ORDER_998877",
  "meta": {
    "itemCount": 2
  }
}
```

#### Response (Success - 200 OK)
```json
{
  "statusCode": 200,
  "message": "Wallet debited successfully",
  "data": {
    "wallet": {
      "_id": "678123456789abcde1234567",
      "user": "678000000000000000000001",
      "balance": 1750,
      "isActive": true,
      "createdAt": "2026-01-11T10:00:00.000Z",
      "updatedAt": "2026-01-11T12:10:00.000Z",
      "__v": 0
    }
  },
  "success": true
}
```

#### Response (Error - 400 Bad Request)
If balance is insufficient:
```json
{
  "statusCode": 400,
  "message": "Insufficient wallet balance",
  "success": false
}
```

---

### 4. Get Wallet History
Retrieves a paginated list of wallet transactions (ledger entries).

- **Method:** `GET`
- **URL:** `/history`
- **Auth Required:** Yes
- **Query Parameters:**
    - `page` (optional): Page number (default: 1).
    - `limit` (optional): Items per page (default: 20).

**Example Request:**
`GET /api/v2/wallet/history?page=1&limit=5`

#### Response (Success - 200 OK)
```json
{
  "statusCode": 200,
  "message": "Wallet history fetched successfully",
  "data": {
    "history": [
      {
        "_id": "678222222222222222222222",
        "wallet": "678123456789abcde1234567",
        "user": "678000000000000000000001",
        "type": "debit",
        "source": "order_payment",
        "amount": 250,
        "openingBalance": 2000,
        "closingBalance": 1750,
        "refId": "ORDER_998877",
        "meta": {
          "itemCount": 2
        },
        "createdAt": "2026-01-11T12:10:00.000Z",
        "updatedAt": "2026-01-11T12:10:00.000Z",
        "__v": 0
      },
      {
        "_id": "678111111111111111111111",
        "wallet": "678123456789abcde1234567",
        "user": "678000000000000000000001",
        "type": "credit",
        "source": "recharge",
        "amount": 500,
        "openingBalance": 1500,
        "closingBalance": 2000,
        "refId": "PAY_123456789",
        "meta": {
          "paymentMethod": "UPI",
          "gateway": "Cashfree"
        },
        "createdAt": "2026-01-11T12:05:00.000Z",
        "updatedAt": "2026-01-11T12:05:00.000Z",
        "__v": 0
      }
    ]
  },
  "success": true
}
```
