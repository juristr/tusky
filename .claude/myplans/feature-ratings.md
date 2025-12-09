# Plan: Ratings API and Frontend Integration

## Summary

Create a ratings API following the existing 3-layer architecture pattern, add shared types, and build frontend data-access + smart UI component.

---

## Phase 1: Backend

### 1.1 Add ProductRating type (`@tusky/api-types`)

**File:** `packages/shared/api-types/src/lib/rating.dto.ts`

```typescript
export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}
```

**File:** `packages/shared/api-types/src/index.ts`

- Add export for rating.dto

### 1.2 Create data-ratings package (`@tusky/data-ratings`)

**New package:** `packages/backend/data-ratings/`

- Create via Nx generator
- **File:** `src/lib/ratings.repository.ts`
- Fake data: ratings for existing product IDs (1-8)
- Methods: `findByProductId(productId: number): ProductRating | undefined`
- Export singleton: `ratingsRepository`

### 1.3 Create service-ratings package (`@tusky/service-ratings`)

**New package:** `packages/backend/service-ratings/`

- Create via Nx generator
- **File:** `src/lib/ratings.service.ts`
- DI pattern: accepts `RatingsRepository`
- Methods: `getRatingByProductId(productId: number)`
- Export singleton: `ratingsService`

### 1.4 Create api-ratings package (`@tusky/api-ratings`)

**New package:** `packages/backend/api-ratings/`

- Create via Nx generator
- **File:** `src/lib/ratings.routes.ts`
- Endpoint: `GET /api/ratings/:productId`
- Fastify schema with swagger docs
- Response: `ProductRating` or 404

### 1.5 Register Routes

**File:** `apps/api/src/app/app.ts`

- Import `ratingsRoutes` from `@tusky/api-ratings`
- Register: `await fastify.register(ratingsRoutes);`

---

## Phase 2: Frontend

### 2.1 Create data-access-ratings package (`@tusky/data-access-ratings`)

**New package:** `packages/frontend/ratings/data-access-ratings/`

- Create via Nx generator
- **File:** `src/lib/data-access-ratings.ts`
- Function: `getRatingByProductId(productId: number): Promise<ProductRating | undefined>`
- Re-export `ProductRating` type

### 2.2 Create ui-ratings package (`@tusky/ui-ratings`)

**New package:** `packages/frontend/ratings/ui-ratings/`

- Create via Nx generator
- **File:** `src/lib/SmartRating.tsx`
- Fetches rating data via `@tusky/data-access-ratings`
- Uses `@tusky/tusky-design` Rating component for display
- Props: `productId: number`, `size?: RatingSize`, `className?: string`
- Loading: Show skeleton placeholder
- Error: Hide rating (graceful degradation)

### 2.3 Refactor ProductDetail

**File:** `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`

- Replace inline Rating with SmartRating component
- Remove `rating` and `reviewCount` from ProductDetailProps interface
- SmartRating fully owns rating display (no fallback)

**File:** `packages/frontend/products/feat-product-detail/package.json`

- Add `@tusky/ui-ratings` dependency

---

## Files Summary

**Create:**

- `packages/shared/api-types/src/lib/rating.dto.ts`
- `packages/backend/data-ratings/` (full package)
- `packages/backend/service-ratings/` (full package)
- `packages/backend/api-ratings/` (full package)
- `packages/frontend/ratings/data-access-ratings/` (full package)
- `packages/frontend/ratings/ui-ratings/` (full package)

**Modify:**

- `packages/shared/api-types/src/index.ts` (add rating export)
- `apps/api/src/app/app.ts` (register ratings routes)
- `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- `packages/frontend/products/feat-product-detail/package.json` (add ui-ratings dep)

## Decisions Made

- SmartRating shows skeleton during loading
- ProductDetail: no fallback; SmartRating fully owns rating display
