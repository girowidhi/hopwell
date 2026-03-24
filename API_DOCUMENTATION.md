# API Documentation

## Authentication Endpoints

### POST /api/auth/verify-otp
Verify OTP and create member profile.

**Request:**
```json
{
  "otp": "123456",
  "userId": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member profile created",
  "member": {
    "id": "member-uuid",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### GET /api/auth/user
Get current authenticated user.

**Response:**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "member": { /* member object */ },
    "role": "member"
  }
}
```

### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Profile Endpoints

### GET /api/profile
Get current user's member profile.

**Response:**
```json
{
  "profile": {
    "id": "member-uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "status": "active"
  }
}
```

### PUT /api/profile
Update member profile.

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+254712345678",
  "date_of_birth": "1990-01-15",
  "gender": "male"
}
```

## Giving Endpoints

### GET /api/giving/transactions
Get user's giving transactions.

**Query Parameters:**
- `limit`: Records per page (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "transactions": [
    {
      "id": "transaction-uuid",
      "amount": 5000,
      "giving_type": "offering",
      "payment_method": "mpesa",
      "transaction_date": "2024-01-15T10:30:00Z",
      "status": "completed"
    }
  ]
}
```

### POST /api/giving/transactions
Create new giving transaction.

**Request:**
```json
{
  "amount": 5000,
  "givingType": "offering",
  "paymentMethod": "mpesa"
}
```

**Response:**
```json
{
  "transaction": {
    "id": "transaction-uuid",
    "amount": 5000,
    "status": "pending"
  }
}
```

## Events Endpoints

### GET /api/events/registrations?eventId=event-uuid
Get event registrations.

**Response:**
```json
{
  "registrations": [
    {
      "id": "registration-uuid",
      "event_id": "event-uuid",
      "member_id": "member-uuid",
      "status": "registered",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/events/registrations
Register for an event.

**Request:**
```json
{
  "eventId": "event-uuid"
}
```

**Response:**
```json
{
  "registration": {
    "id": "registration-uuid",
    "status": "registered"
  }
}
```

## Notifications

### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `limit`: Records per page
- `read`: Filter by read status (true/false)

**Response:**
```json
{
  "notifications": [
    {
      "id": "notification-uuid",
      "title": "New Event",
      "message": "A new event has been scheduled",
      "type": "info",
      "read": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### PATCH /api/notifications
Mark notification as read.

**Request:**
```json
{
  "id": "notification-uuid"
}
```

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

## Sermons

### GET /api/sermons/search
Search sermons.

**Request:**
```json
{
  "query": "faith"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "sermon-uuid",
      "title": "Having Faith in God",
      "speaker_id": "member-uuid",
      "sermon_date": "2024-01-15",
      "audio_url": "https://...",
      "video_url": "https://..."
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description",
  "status": 400,
  "details": {
    "code": "ERROR_CODE",
    "message": "Detailed error information"
  }
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Rate Limiting

API endpoints are rate limited:
- Authenticated users: 100 requests/minute
- Unauthenticated: 10 requests/minute

Headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (unix timestamp)

## Pagination

All list endpoints support pagination:

```
GET /api/giving/transactions?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Authentication

Include Bearer token in Authorization header:

```
Authorization: Bearer your-jwt-token
```

Or include session cookie (automatically handled by browser).

## Webhooks

Webhook events:
- `member.created`: New member registration
- `transaction.completed`: Donation completed
- `event.registered`: Member registered for event
- `prayer_request.created`: New prayer request

Configure webhooks in dashboard settings.
