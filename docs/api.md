# Backend Logging API

## Overview

This API logs user events to the database.

## Base URL

`http://localhost:4000/api`

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
