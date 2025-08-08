# TechFeed Hub API Documentation

## Overview
TechFeed Hub API provides endpoints for retrieving and managing technology articles aggregated from various RSS feeds.

## Base URL
```
http://localhost:8080
```

## Endpoints

### Health Check
#### GET /actuator/health
Check the API server health status.

**Response:**
```json
{
  "status": "UP"
}
```

---

### Articles

#### GET /api/v1/articles
Retrieve paginated list of articles.

**Query Parameters:**
- `page` (int, optional): Page number (default: 0)
- `size` (int, optional): Page size (default: 20, max: 100)
- `startDate` (ISO DateTime, optional): Filter articles from this date
- `endDate` (ISO DateTime, optional): Filter articles until this date
- `blogId` (string, optional): Filter articles by blog ID
- `keyword` (string, optional): Search articles by keyword (title, content, summary)

**Example Requests:**
```bash
# Get first page with 5 articles
curl "http://localhost:8080/api/v1/articles?page=0&size=5"

# Search for Spring-related articles
curl "http://localhost:8080/api/v1/articles?keyword=Spring"

# Get articles from specific blog
curl "http://localhost:8080/api/v1/articles?blogId=01HZKK0000000000000000BLOG"

# Get articles within date range
curl "http://localhost:8080/api/v1/articles?startDate=2025-08-01T00:00:00&endDate=2025-08-08T23:59:59"
```

**Response:**
```json
{
  "content": [
    {
      "id": "01HZKK0000000000000000ART1",
      "blogId": "01HZKK0000000000000000BLOG",
      "title": "Spring Boot APIサーバー構築ガイド",
      "url": "https://example.com/spring-boot-guide",
      "content": "Spring Bootを使用したAPIサーバーの構築方法について解説します。",
      "summary": "Spring Boot APIの基本的な構築手順",
      "aiSummary": null,
      "excerpt": null,
      "author": null,
      "language": "ja",
      "publishedAt": "2025-08-08T01:00:00",
      "viewCount": 0,
      "readingTimeMinutes": null,
      "createdAt": "2025-08-08T04:55:59"
    }
  ],
  "page": 0,
  "size": 5,
  "totalElements": 3,
  "totalPages": 1,
  "first": true,
  "last": true,
  "hasNext": false,
  "hasPrevious": false
}
```

#### GET /api/v1/articles/{id}
Retrieve a specific article by ID.

**Path Parameters:**
- `id` (string, required): Article ULID

**Example Request:**
```bash
curl "http://localhost:8080/api/v1/articles/01HZKK0000000000000000ART1"
```

**Response:**
```json
{
  "id": "01HZKK0000000000000000ART1",
  "blogId": "01HZKK0000000000000000BLOG",
  "title": "Spring Boot APIサーバー構築ガイド",
  "url": "https://example.com/spring-boot-guide",
  "content": "Spring Bootを使用したAPIサーバーの構築方法について解説します。",
  "summary": "Spring Boot APIの基本的な構築手順",
  "aiSummary": null,
  "excerpt": null,
  "author": null,
  "language": "ja",
  "publishedAt": "2025-08-08T01:00:00",
  "viewCount": 0,
  "readingTimeMinutes": null,
  "createdAt": "2025-08-08T04:55:59"
}
```

**Error Response (Article not found):**
```http
HTTP/1.1 404 Not Found
```

#### GET /api/v1/articles/count
Get the count of articles within a date range.

**Query Parameters:**
- `startDate` (ISO DateTime, required): Count articles from this date
- `endDate` (ISO DateTime, required): Count articles until this date

**Example Request:**
```bash
curl "http://localhost:8080/api/v1/articles/count?startDate=2025-08-01T00:00:00&endDate=2025-08-08T23:59:59"
```

**Response:**
```json
3
```

**Error Response (Missing parameters):**
```http
HTTP/1.1 400 Bad Request
```

---

## Response Fields

### ArticleResponse
| Field | Type | Description |
|-------|------|-------------|
| id | String | ULID of the article |
| blogId | String | ULID of the source blog |
| title | String | Article title |
| url | String | Original article URL |
| content | String | Article full content |
| summary | String | Article summary |
| aiSummary | String | AI-generated summary (nullable) |
| excerpt | String | Article excerpt (nullable) |
| author | String | Article author (nullable) |
| language | String | Article language (default: "ja") |
| publishedAt | ISO DateTime | Publication date |
| viewCount | Integer | View count (default: 0) |
| readingTimeMinutes | Integer | Estimated reading time (nullable) |
| createdAt | ISO DateTime | Record creation timestamp |

### PageResponse<T>
| Field | Type | Description |
|-------|------|-------------|
| content | Array<T> | Page content |
| page | Integer | Current page number (0-based) |
| size | Integer | Page size |
| totalElements | Long | Total number of elements |
| totalPages | Integer | Total number of pages |
| first | Boolean | Is first page |
| last | Boolean | Is last page |
| hasNext | Boolean | Has next page |
| hasPrevious | Boolean | Has previous page |

---

## Error Handling

### HTTP Status Codes
- `200 OK`: Success
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### CORS Support
The API supports CORS and allows requests from all origins during development.

---

## Development Commands

### Starting the API Server
```bash
# Start database and API server
task api-up

# Build API server Docker image
task api-build

# View API server logs
task api-logs

# Stop API server
task api-down
```

### Testing the API
```bash
# Test health check
task api-test

# Or manually test endpoints
curl "http://localhost:8080/actuator/health"
curl "http://localhost:8080/api/v1/articles?page=0&size=5"
```