# Wallet Module

Base URL: `/api/v2/wallet`

## Endpoints

### Get Wallet Balance
`GET /`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/wallet \
  -H "Authorization: Bearer <TOKEN>"
```

### Credit Wallet
`POST /credit`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `amount` (number, required)
- `source` (string, required)
- `refId` (string, optional)
- `meta` (object, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/wallet/credit \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "source": "manual_recharge",
    "refId": "txn_12345",
    "meta": { "description": "Bonus" }
  }'
```

### Debit Wallet
`POST /debit`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
- `amount` (number, required)
- `source` (string, required)
- `refId` (string, optional)
- `meta` (object, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/wallet/debit \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "source": "service_payment",
    "refId": "order_67890"
  }'
```

### Get Wallet History
`GET /history`

**Headers:**
- `Authorization: Bearer <TOKEN>`

**Query Parameters:**
- `page` (number, default 1)
- `limit` (number, default 20)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/v2/wallet/history?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```
