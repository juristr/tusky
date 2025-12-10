# Ratings Feature Implementation Plan

## Overview

New `/api/ratings/:productId` endpoint returning aggregated rating data (avg + count) for a product, plus frontend packages to fetch/display this data.

---

## Phase 1: Backend

### 1.1 Shared Types (`packages/shared/api-types/`)

- Create `src/lib/rating.dto.ts`:

```typescript
export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}
```

- Export from `src/index.ts`

### 1.2 Data Layer (`packages/backend/data-ratings/`)

Create via Nx generator:

```bash
nx g @nx/js:library data-ratings --directory=packages/backend/data-ratings --bundler=tsc
```

Files:

- `src/lib/ratings.repository.ts` - Mock data with individual ratings, methods: `findByProductId(productId)`
- Mock data structure:

```typescript
interface Rating {
  id: number;
  productId: number;
  value: number;
}
```

### 1.3 Service Layer (`packages/backend/service-ratings/`)

Create via Nx generator:

```bash
nx g @nx/js:library service-ratings --directory=packages/backend/service-ratings --bundler=tsc
```

Files:

- `src/lib/ratings.service.ts` - `getAggregatedRating(productId)` returns `ProductRating` (calculates avg/count from repository data)

### 1.4 API Layer (`packages/backend/api-ratings/`)

Create via Nx generator:

```bash
nx g @nx/js:library api-ratings --directory=packages/backend/api-ratings --bundler=tsc
```

Files:

- `src/lib/ratings.routes.ts` - Route: `GET /api/ratings/:productId`
- `src/types/fastify-swagger.d.ts` - Same module augmentation as api-products
- Swagger schema for response (ProductRating shape)

### 1.5 Register Routes

- Update `apps/api/src/app/app.ts`:

```typescript
import { ratingsRoutes } from '@tusky/api-ratings';
await fastify.register(ratingsRoutes);
```

### 1.6 TSConfig References

Chain: data-ratings → service-ratings → api-ratings
All reference api-types

---

## Phase 2: Frontend

### 2.1 Data Access (`packages/frontend/ratings/data-access-ratings/`)

Create via Nx generator:

```bash
nx g @nx/react:library data-access-ratings --directory=packages/frontend/ratings/data-access-ratings --bundler=vite
```

Files:

- `src/lib/data-access-ratings.ts`:

```typescript
export async function getRatingByProductId(productId: number): Promise<ProductRating>;
```

### 2.2 UI Component (`packages/frontend/ratings/ui-ratings/`)

Create via Nx generator:

```bash
nx g @nx/react:library ui-ratings --directory=packages/frontend/ratings/ui-ratings --bundler=vite
```

Files:

- `src/lib/ProductRatingDisplay.tsx` - Smart component that:
  - Takes `productId` prop
  - Fetches rating via data-access-ratings
  - Handles loading/error states
  - Renders `<Rating>` from tusky-design with fetched data

### 2.3 Refactor ProductDetail

Update `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`:

- Replace direct `<Rating>` usage with `<ProductRatingDisplay productId={...} />`
- Remove `rating`/`reviewCount` from props interface (fetched internally now)

---

## Files Modified/Created Summary

**Created:**

- `packages/shared/api-types/src/lib/rating.dto.ts`
- `packages/backend/data-ratings/` (new package)
- `packages/backend/service-ratings/` (new package)
- `packages/backend/api-ratings/` (new package)
- `packages/frontend/ratings/data-access-ratings/` (new package)
- `packages/frontend/ratings/ui-ratings/` (new package)

**Modified:**

- `packages/shared/api-types/src/index.ts`
- `apps/api/src/app/app.ts`
- `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- `packages/frontend/products/feat-product-detail/package.json` (add ui-ratings dep)
- `packages/frontend/products/feat-product-detail/tsconfig.lib.json` (add reference)

---

## Decisions Made

- **Mock data**: Generate 5-15 random ratings (1-5 values) per product
- **Refactor target**: `feat-product-detail/ProductDetail.tsx` (not the placeholder ui-product-detail)
- **Loading state**: Skeleton placeholder (gray stars) while fetching
