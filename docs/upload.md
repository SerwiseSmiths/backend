# Upload Module

Base URL: `/api/v2/upload`

## Overview

The Upload module provides endpoints for uploading files to Cloudinary. Supports images, videos, and documents.

## Allowed File Types

| Category | MIME Types |
|----------|------------|
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Videos | `video/mp4`, `video/webm` |
| Documents | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

---

## Endpoints

### Upload Single File
`POST /single`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: The file to upload

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "publicUrl": "https://res.cloudinary.com/...",
      "publicId": "servicesmith/abc123",
      "type": "image/jpeg",
      "size": 102400,
      "originalName": "photo.jpg",
      "format": "jpg",
      "width": 1920,
      "height": 1080
    }
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/upload/single \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/image.jpg"
```

---

### Upload Multiple Files
`POST /multiple`

**Headers:**
- `Authorization: Bearer <TOKEN>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `files`: Array of files (max 10)

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Files uploaded successfully",
  "data": {
    "files": [
      {
        "publicUrl": "https://res.cloudinary.com/...",
        "publicId": "servicesmith/abc123",
        "type": "image/jpeg",
        "size": 102400,
        "originalName": "photo1.jpg"
      },
      {
        "publicUrl": "https://res.cloudinary.com/...",
        "publicId": "servicesmith/def456",
        "type": "image/png",
        "size": 204800,
        "originalName": "photo2.png"
      }
    ],
    "errors": []
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/v2/upload/multiple \
  -H "Authorization: Bearer <TOKEN>" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png"
```

---

## Usage with Complaints

After uploading files, use the returned `publicUrl` and `type` in the complaint media array:

```bash
curl -X POST http://localhost:3000/api/v2/complaint \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AC Not Cooling",
    "addressId": "<ADDRESS_ID>",
    "media": [
      {"publicUrl": "https://res.cloudinary.com/...", "type": "image/jpeg"},
      {"publicUrl": "https://res.cloudinary.com/...", "type": "video/mp4"}
    ]
  }'
```

---

## Error Responses

| Status | Message |
|--------|---------|
| 400 | No file uploaded |
| 400 | File type not allowed |
| 400 | Maximum 10 files allowed |
| 500 | Failed to upload file to cloud storage |

---

## Environment Variables

Required in `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
