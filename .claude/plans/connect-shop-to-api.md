# Plan: Connect Shop App to Products API

## Overview

Connect frontend shop app to backend products API in 4 phases, each independently verified and committed.

## Current State

- **Backend**: Fastify API at `:3000` with `GET /api/products` and `GET /api/products/:id`
- **Frontend**: Hardcoded mock data in `@tusky/data-access-products`
- **Problem**: Product type duplicated in backend `api-dtos` and frontend `data-access-products`

---

## Phase 1: Move API Types to Shared Package

Move `@tusky/api-dtos` from `/packages/backend/` to `/packages/shared/api-types`.

### Changes:

1. Move `packages/backend/api-dtos/` → `packages/shared/api-types/`
2. Rename package `@tusky/api-dtos` → `@tusky/api-types`
3. Update imports in `service-products`, `data-products`

### Files:

- `packages/backend/api-dtos/` → `packages/shared/api-types/`
- `packages/shared/api-types/package.json` - rename package
- `packages/backend/service-products/package.json` - update dep
- `packages/backend/data-products/package.json` - update dep
- `packages/backend/service-products/src/lib/products.service.ts` - update import
- `packages/backend/data-products/src/lib/products.repository.ts` - update import

### Verify & Commit:

```bash
pnpm nx run-many -t build test lint typecheck test-storybook
git add . && git commit -m "refactor: move api-dtos to shared/api-types"
git push
```

---

## Phase 2: Connect data-access-products to Shared Types

Add `@tusky/api-types` dep to frontend data-access, remove duplicate Product interface.

### Changes:

1. Add `@tusky/api-types` as dependency
2. Remove local Product interface
3. Re-export Product from `@tusky/api-types` (backwards compat)

### Files:

- `packages/frontend/products/data-access-products/package.json` - add dep
- `packages/frontend/products/data-access-products/src/lib/data-access-products.ts` - import from api-types
- `packages/frontend/products/data-access-products/src/index.ts` - re-export Product

### Verify & Commit:

```bash
pnpm install
pnpm nx run-many -t build test lint typecheck test-storybook
git add . && git commit -m "refactor(data-access-products): use shared api-types"
git push
```

---

## Phase 3: Refactor Data Access to Async HTTP

Convert sync mock functions to async fetch calls.

### Changes:

1. Create `apps/shop/.env` with `VITE_API_URL`
2. Refactor `getProducts()` and `getProductById()` to async fetch
3. Remove hardcoded mock data

### Files:

- `apps/shop/.env` - create with `VITE_API_URL=http://localhost:3000`
- `packages/frontend/products/data-access-products/src/lib/data-access-products.ts` - async HTTP

### Code:

```typescript
import { Product } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export type { Product };
```

### Verify & Commit:

```bash
pnpm nx run-many -t build test lint typecheck test-storybook
git add . && git commit -m "feat(data-access-products): add async HTTP fetch"
git push
```

---

## Phase 4: Update Components for Async Loading

Update ProductGrid and ProductDetailPage with loading/error states.

### Changes:

1. ProductGrid: `useState` + `useEffect` for async fetch, loading/error UI
2. ProductDetailPage: same pattern, handle not-found

### Files:

- `packages/frontend/products/feat-product-list/src/lib/ProductGrid.tsx`
- `packages/frontend/products/feat-product-detail/src/pages/ProductDetailPage.tsx`

### Verify & Commit:

```bash
pnpm nx run-many -t build test lint typecheck test-storybook
git add . && git commit -m "feat(shop): connect product components to API"
git push
```

---

## Summary

| Phase | Description                      | Commit Message                                         |
| ----- | -------------------------------- | ------------------------------------------------------ |
| 1     | Move api-dtos to shared          | `refactor: move api-dtos to shared/api-types`          |
| 2     | Connect frontend to shared types | `refactor(data-access-products): use shared api-types` |
| 3     | Async HTTP in data-access        | `feat(data-access-products): add async HTTP fetch`     |
| 4     | Update components                | `feat(shop): connect product components to API`        |
