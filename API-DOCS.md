# API Documentation

## Overview

This document describes the planned API architecture for the 90 Days Ascension Journey Dashboard. Currently, the app uses LocalStorage for data persistence. The API layer is designed for future backend integration.

## Base URL

```
Production: https://api.ascension-journey.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Authenticate user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/logout
Logout user (invalidate token).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Profile

#### GET /user
Get current user profile.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00Z",
    "settings": {
      "theme": "vibrant",
      "notifications": true
    }
  }
}
```

#### PATCH /user
Update user profile.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "settings": {
    "theme": "dark"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Updated",
    ...
  }
}
```

### Progress & XP

#### GET /progress/:domain
Get progress for a specific domain.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `domain`: Journey domain ID (e.g., "body-transformation")

**Response:**
```json
{
  "success": true,
  "data": {
    "domain": "body-transformation",
    "completedDays": [1, 2, 3, 5, 7],
    "totalDays": 90,
    "progressPercentage": 5.6,
    "lastCompleted": "2025-01-07T00:00:00Z"
  }
}
```

#### POST /tasks/complete
Mark a task as completed.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "domain": "body-transformation",
  "dayNumber": 1,
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "domain": "body-transformation",
      "dayNumber": 1,
      "completed": true,
      "completedAt": "2025-01-01T00:00:00Z"
    },
    "xpGained": 25
  }
}
```

#### GET /xp
Get XP summary.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "global": 1250,
    "domains": {
      "body-transformation": 300,
      "reading": 200,
      "writers": 150,
      "dual-brand": 100,
      "software-engineering": 500
    },
    "level": {
      "current": 5,
      "currentXP": 250,
      "xpToNext": 500
    }
  }
}
```

#### GET /streaks
Get streak information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "current": 7,
    "longest": 12,
    "lastDate": "2025-01-07"
  }
}
```

### Journeys

#### GET /journey/:domain
Get journey data for a domain.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `domain`: Journey domain ID

**Response:**
```json
{
  "success": true,
  "data": {
    "journey": {
      "id": "body-transformation",
      "title": "Body Transformation",
      "icon": "💪",
      "totalDays": 90,
      "weeks": [ ... ]
    },
    "progress": {
      "completedDays": [1, 2, 3],
      "progressPercentage": 3.3
    }
  }
}
```

#### POST /journey/:domain/log
Log activity for a journey.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "dayNumber": 1,
  "notes": "Completed morning workout",
  "data": {
    "workoutDuration": 45,
    "caloriesBurned": 300
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "log": {
      "id": "log_123",
      "domain": "body-transformation",
      "dayNumber": 1,
      "notes": "Completed morning workout",
      "data": { ... },
      "createdAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

#### GET /journey/:domain/resources
Get learning resources for a domain.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "res_1",
        "title": "Workout Guide",
        "url": "https://example.com",
        "type": "video",
        "duration": "30 min"
      }
    ]
  }
}
```

### Achievements

#### GET /achievements
Get all achievements.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "unlocked": [
      {
        "id": "3-day-start",
        "title": "3-Day Start",
        "unlockedAt": "2025-01-03T00:00:00Z"
      }
    ],
    "locked": [
      {
        "id": "week-warrior",
        "title": "Week Warrior",
        "progress": 57.1
      }
    ]
  }
}
```

#### POST /achievements/unlock
Manually unlock an achievement (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "achievementId": "3-day-start"
}
```

### Settings

#### GET /settings
Get user settings.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "theme": "vibrant",
    "notifications": true,
    "emailUpdates": false
  }
}
```

#### PATCH /settings
Update user settings.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "theme": "dark",
  "notifications": false
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `INVALID_TOKEN` | 401 | Invalid or expired token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## Versioning

API version is included in the URL path:
- `/v1/...` - Current version
- Future versions: `/v2/...`

## Webhooks (Future)

Webhook endpoints for real-time updates:
- `POST /webhooks/progress-update`
- `POST /webhooks/achievement-unlocked`

