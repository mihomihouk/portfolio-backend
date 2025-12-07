# Backend Logging API

## Overview

This API logs user events to the database.

## Base URL

`<server-url>/api`

## Endpoints

### POST /log

Log an event.

**Request Body:**

| Field     | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| event     | string | yes      | Name of the event            |
| path      | string | yes      | Path/page where event occurs |
| referrer  | string | no       | Referrer URL                 |
| userAgent | string | no       | Browser or client info       |
| ip        | string | no       | IP address of the client     |

**Example Request:**

```json
{
  "event": "click",
  "path": "/home",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0",
  "ip": "127.0.0.1"
}
```

**Responses:**

- 200 if success

```json
{ "ok": true }
```

- 403 if it's a bot

**Bot Detection:**

The logging API includes logic to exclude bot traffic from being recorded. Bots are identified based on the following criteria:

1. User-Agent Patterns
   Requests are checked against a curated list of known bot User-Agent strings.

2. IP Blacklist
   Requests from blacklisted IPs are considered bot traffic.

### GET /visitor-analytics

Get visitor statistics and page popularity data.

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                 |
| --------- | ------ | -------- | ------- | --------------------------- |
| daysAgo   | number | no       | 30      | Number of days to look back |

**Example Request:**

```json

GET /api/visitor-analytics?daysAgo=7

```

**Responses:**

- 200 if success

```
{
  "visitorCount": [
    { "visits": "42", "date": "2024-12-01" },
    { "visits": "38", "date": "2024-12-02" }
  ],
  "pagePopularity": [
    { "visits": "100", "page": "/" },
    { "visits": "45", "page": "/projects" }
  ]
}
```

- 500 if server error

```
{ "error": "Internal server error" }
```
