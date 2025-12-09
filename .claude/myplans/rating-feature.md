# Product Ratings Feature Implementation Plan

## Phase 1: Backend

### 1.1 Shared Types
**File:** `packages/shared/api-types/src/lib/rating.dto.ts`
```typescript
export interface UserRating {
  id: number;
  productId: number;
  userId: number;
  rating: number;  // 0-5
  review: string;
  createdAt: string;
}

export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}
```
- Export from `packages/shared/api-types/src/index.ts`

### 1.2 Data Layer
**Generate:** `nx g @nx/js:library data-ratings --directory=packages/backend/data-ratings`

**File:** `packages/backend/data-ratings/src/lib/ratings.repository.ts`
- In-memory `UserRating[]` with 3-5 sample ratings per product (0-5 stars, review text, arbitrary userId)
- `RatingsRepository` class:
  - `findByProductId(productId: number): UserRating[]`
  - `getAggregated(productId: number): ProductRating | undefined`
- Singleton export

### 1.3 Service Layer
**Generate:** `nx g @nx/js:library service-ratings --directory=packages/backend/service-ratings`

**File:** `packages/backend/service-ratings/src/lib/ratings.service.ts`
- `RatingsService` class:
  - `getByProductId(productId: number): UserRating[]`
  - `getProductRating(productId: number): ProductRating | undefined`
- Inject repository, singleton export

### 1.4 API Layer
**Generate:** `nx g @nx/js:library api-ratings --directory=packages/backend/api-ratings`

**File:** `packages/backend/api-ratings/src/lib/ratings.routes.ts`
- `ratingsRoutes(fastify: FastifyInstance)` async function
- Endpoints:
  - `GET /api/ratings/:productId` → `ProductRating`
  - `GET /api/ratings/:productId/all` → `UserRating[]`
- Swagger schemas

### 1.5 Register Routes
**File:** `apps/api/src/app/app.ts`
- Import and register `ratingsRoutes`

### 1.6 Validation
Run: `pnpm nx run-many -t test,lint,build --projects=api-types,data-ratings,service-ratings,api-ratings,api`

---

## Phase 2: Frontend

### 2.1 Data Access
**Generate:** `nx g @nx/react:library data-access-ratings --directory=packages/frontend/ratings/data-access-ratings`

**File:** `packages/frontend/ratings/data-access-ratings/src/lib/data-access-ratings.ts`
```typescript
export async function getRatingByProductId(productId: number): Promise<ProductRating | undefined>
export async function getAllRatingsByProductId(productId: number): Promise<UserRating[]>
```
- Uses fetch with `VITE_API_URL`
- Re-exports types

### 2.2 Smart UI Component
**Generate:** `nx g @nx/react:library ui-ratings --directory=packages/frontend/ratings/ui-ratings`

**File:** `packages/frontend/ratings/ui-ratings/src/lib/SmartRating.tsx`
```typescript
interface SmartRatingProps {
  productId: number;
  size?: RatingSize;
  className?: string;
}
```
- Fetches via `getRatingByProductId()`
- Loading/error states
- Renders `<Rating>` from `@tusky/tusky-design`

### 2.3 Refactor ProductDetail
**File:** `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- Import `SmartRating` from `@tusky/ui-ratings`
- Replace hardcoded `<Rating>` with `<SmartRating productId={product.id} />`
- Remove `rating`/`reviewCount` from props interface

### 2.4 Validation
Run: `pnpm nx run-many -t test,lint,build,test-storybook --all`

---

## Decisions
- Sample data: 3-5 ratings per product (0-5 stars, review text, arbitrary userId)
- SmartRating: aggregate display only (avg + count)
- API routes: `/api/ratings/:productId` and `/api/ratings/:productId/all`
