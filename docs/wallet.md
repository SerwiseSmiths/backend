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
Deducts funds from the user's wallet. Checks for sufficient balance before processing.

- **Method:** `POST`
- **URL:** `/debit`
- **Auth Required:** Yes

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `amount` | `number` | Yes | Amount to deduct (must be > 0). |
| `source` | `string` | Yes | Reason for deduction. Allowed values: `order_payment`, `transfer`. |
| `refId` | `string` | Conditional | Reference ID. **Required when source is `transfer`** - should be the recipient's phone number. |
| `meta` | `object` | No | Any additional metadata. |

> [!IMPORTANT]
> **Transfer Feature:** When `source` is set to `transfer`, the `refId` field must contain the recipient's phone number. The system will:
> 1. Debit the specified amount from the sender's wallet
> 2. Look up the recipient user by phone number
> 3. Credit the same amount to the recipient's wallet
> 4. Create ledger entries for both sender (debit) and recipient (credit)
> 
> If the recipient is not found, the transaction will fail and no debit will occur.

**Example Request (Order Payment):**
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

**Example Request (Transfer to another user):**
```json
{
  "amount": 500,
  "source": "transfer",
  "refId": "9876543210",
  "meta": {
    "note": "Payment for services"
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

#### Response (Error - 404 Not Found)
If recipient phone number is invalid (for transfer):
```json
{
  "statusCode": 404,
  "message": "Recipient user not found with the provided phone number",
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

---

### 5. Create Wallet (Admin/Internal)
Explicitly creates a wallet for a user. If wallet exists, returns existing wallet.

- **Method:** `POST`
- **URL:** `/create`
- **Auth Required:** Yes

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | The User ID to create wallet for. |

#### Response (Success - 201 Created)
```json
{
  "statusCode": 201,
  "message": "Wallet created successfully",
  "data": { "wallet": { ... } },
  "success": true
}
```

---

### 6. Get Wallet By User ID (Admin/Internal)
Retrieves wallet details for a specific user.

- **Method:** `GET`
- **URL:** `/user/:userId`
- **Auth Required:** Yes

#### Response (Success - 200 OK)
Same as **Get Wallet Details**.

---

### 7. Self Wallet
Retrieves the logged-in user's wallet (Alias for `GET /api/v2/wallet/`).

- **Method:** `GET`
- **URL:** `/api/v2/me/wallet`
- **Auth Required:** Yes

