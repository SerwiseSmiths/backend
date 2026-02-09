# Device Type Module

Base URL: `/api/v2/device-type`

## Overview

Device Types can be managed either locally in MongoDB or fetched from Strapi CMS. When using Strapi integration, Operations Managers can edit device types without technical knowledge.

## Strapi CMS Integration

> [!NOTE]
> Device types are primarily managed in Strapi CMS for easy editing by operations team.

### Strapi DeviceType Schema
```json
{
  "id": 12,
  "name": "Washing Machine",
  "status": "active",
  "icon": "washing-machine.svg"
}
```

### Environment Variables
```
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
```

### Strapi Service
The backend includes a Strapi service with caching:

```typescript
import strapiService from "./services/strapi.service";

// Fetch all device types
const types = await strapiService.fetchDeviceTypes();

// Fetch by Strapi ID
const type = await strapiService.fetchDeviceTypeById(12);

// Get only active types
const active = await strapiService.getActiveDeviceTypes();

// Validate device type ID
const isValid = await strapiService.validateDeviceTypeId(12);
```

---

## Local MongoDB Endpoints

### Create Device Type
`POST /`

**Headers:**
- `Content-Type: application/json`

**Body Parameters:**
- `name` (string, required)
- `description` (string, optional)
- `is_deleted` (boolean, optional)

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/device-type \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RO Water Purifier",
    "description": "Standard RO Machine"
  }'
```

### List Device Types
`GET /`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device-type
```

### Get Device Type by ID
`GET /:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID>
```

### Update Device Type
`PUT /:id`

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RO Water Purifier - Lite"
  }'
```

### Delete Device Type
`DELETE /:id`

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v2/device-type/<DEVICE_TYPE_ID>
```

---

## Usage in Complaints

When creating complaints, use `deviceTypeId` with the Strapi ID (string):

```bash
curl -X POST http://localhost:3000/api/v2/complaint \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling",
    "addressId": "<ADDRESS_ID>",
    "deviceTypeId": "12"
  }'
```

The `deviceTypeId` refers to the Strapi CMS ID, while `deviceId` (added later by provider) refers to the specific user device in MongoDB.
