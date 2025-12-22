# Portfolio Backend

## Overview

Backend API for my portfolio website. Provides event logging and visitor analytics endpoints to power the public-facing analytics dashboard. Includes bot detection to filter out non-human traffic.

The backend follows a layered MVC-inspired architecture commonly used in production APIs.

## Related Repository

- [Frontend](https://github.com/mihomihouk/Portfolio_Website)

## Languages, Libraries, Frameworks, Tools

- Node.js
- Express
- TypeScript
- PostgreSQL
- Vitest

## Architecture

### MVC + Service Layer

- **Controllers / Routes**: Handle HTTP requests, validation, and responses.
- **Services**: Contain business logic and coordinate repositories and utilities.
- **Repositories**: Encapsulate database access and SQL queries.
- **Models**: Represent domain entities (e.g. Log) when domain-level behavior is needed.

### Dependency Injection

The project uses constructor-based dependency injection to decouple components:

- Services receive repositories via constructors
- Improves testability and separation of concerns
- Allows easy mocking in unit tests

DI is implemented manually to keep the codebase lightweight and explicit.

### Data Transfer Objects (DTOs)

DTOs define clear, typed contracts at API boundaries and between layers.

- Validate request bodies and query parameters
- Enforce consistent data shapes
- Improve type safety and maintainability

Validation is performed via middleware before reaching controllers or services.

## Error Handling

- Centralised error handling middleware
- Custom error classes

## Main Functions

- Event logging API
- Visitor analytics API (daily counts, page popularity)
- Bot detection (User-Agent patterns, IP filtering)
- Automated cleanup of logs older than 60 days (via Supabase pg_cron)

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
