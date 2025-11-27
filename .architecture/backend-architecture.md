# Backend Architecture

## Overview

Layered Fastify backend serving a Products API with Swagger documentation.

## Project Structure

```
apps/
  api/                           # Fastify application entry point
    src/
      main.ts                    # Server bootstrap
      app/
        app.ts                   # App factory, plugin registration
        app.spec.ts              # Integration tests

packages/backend/
  api-dtos/                      # Shared TypeScript interfaces
  api-products/                  # API layer (routes, controllers)
  service-products/              # Business logic layer
  data-products/                 # Data access layer (repository)
```

## Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     apps/api                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Fastify Server                                  │   │
│  │  - CORS (@fastify/cors)                         │   │
│  │  - Swagger (@fastify/swagger, @fastify/swagger-ui)│  │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ registers
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  @tusky/api-products                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  productsRoutes                                  │   │
│  │  - GET /api/products                            │   │
│  │  - GET /api/products/:id                        │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ calls
                           ▼
┌─────────────────────────────────────────────────────────┐
│                @tusky/service-products                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ProductsService                                 │   │
│  │  - getAll(): Product[]                          │   │
│  │  - getById(id): Product | undefined             │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ calls
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 @tusky/data-products                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ProductsRepository                              │   │
│  │  - findAll(): Product[]                         │   │
│  │  - findById(id): Product | undefined            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  @tusky/api-dtos                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Product interface                               │   │
│  │  { id, name, price, originalPrice?, rating,     │   │
│  │    image, category }                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Dependency Graph

```
apps/api
  └── @tusky/api-products
        └── @tusky/service-products
              ├── @tusky/data-products
              │     └── @tusky/api-dtos
              └── @tusky/api-dtos
```

## Layer Responsibilities

| Layer   | Package                   | Responsibility                                             |
| ------- | ------------------------- | ---------------------------------------------------------- |
| API     | `@tusky/api-products`     | HTTP routes, request/response handling, validation schemas |
| Service | `@tusky/service-products` | Business logic, orchestration                              |
| Data    | `@tusky/data-products`    | Data access, repository pattern                            |
| DTOs    | `@tusky/api-dtos`         | Shared TypeScript interfaces                               |

## API Endpoints

| Method | Endpoint            | Description       | Response         |
| ------ | ------------------- | ----------------- | ---------------- |
| GET    | `/api/products`     | List all products | `Product[]`      |
| GET    | `/api/products/:id` | Get product by ID | `Product` or 404 |
| GET    | `/docs`             | Swagger UI        | HTML             |
| GET    | `/docs/json`        | OpenAPI spec      | JSON             |

## Configuration

### CORS

- Enabled for all origins (`origin: true`)

### Swagger

- OpenAPI 3.0.3
- UI available at `/docs`
- JSON spec at `/docs/json`

## Testing Strategy

| Package                   | Test Type   | Coverage                         |
| ------------------------- | ----------- | -------------------------------- |
| `@tusky/data-products`    | Unit        | Repository methods               |
| `@tusky/service-products` | Unit        | Service with mocked repository   |
| `@tusky/api-products`     | Unit        | Routes with mocked service       |
| `apps/api`                | Integration | Full HTTP request/response cycle |

## Commands

```bash
# Development
nx serve api                    # Start at http://localhost:3000

# Build
nx build api                    # Build all layers

# Test
nx test @tusky/data-products    # Test data layer
nx test @tusky/service-products # Test service layer
nx test @tusky/api-products     # Test API layer
nx test @tusky/api              # Integration tests
nx run-many -t test             # Run all tests
```

## Adding New Features

1. **New DTO**: Add interface to `@tusky/api-dtos`
2. **New Repository**: Add to `@tusky/data-products`
3. **New Service**: Add to `@tusky/service-products`
4. **New Routes**: Add to `@tusky/api-products`, register in `apps/api/src/app/app.ts`
