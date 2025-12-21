# Portfolio Backend

## Overview

Backend API for my portfolio website. Provides event logging and visitor analytics endpoints to power the public-facing analytics dashboard. Includes bot detection to filter out non-human traffic.

The backend is structured following the MVC pattern:
- Models: Represent domain entities such as Log.
- Repositories: Handle database access and queries.
- Controllers / Routes: Handle HTTP requests, validation and responses.

## Related Repository

- [Frontend](https://github.com/mihomihouk/Portfolio_Website)

## Languages, Libraries, Frameworks, Tools

- Node.js
- Express
- TypeScript
- PostgreSQL
- Vitest

## Main Functions

- Event logging API
- Visitor analytics API (daily counts, page popularity)
- Bot detection (User-Agent patterns, IP filtering)

## API Documentation

For full API documentation, see [docs/api.md](docs/api.md)

## Scripts

### Development

```
npm run dev
```

### Run database migrations

```
npm run migrate
```

## Development

- Developer: Miho Inagaki
