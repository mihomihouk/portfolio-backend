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

- 403 if it's a bot

**Bot Detection**
The logging API includes logic to exclude bot traffic from being recorded. Bots are identified based on the following criteria:

1. User-Agent Patterns
   Requests are checked against a curated list of known bot User-Agent strings.

2. IP Blacklist
   Requests from blacklisted IPs are considered bot traffic.
