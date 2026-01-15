# Ratings Feature Implementation Plan

## Overview
Add ratings API + frontend components for fetching/displaying product ratings with half-star support and review modal.

---

## PHASE 1: Backend

### 1.1 Shared Types (`@tusky/api-types`)

**File:** `packages/shared/api-types/src/lib/rating.dto.ts`
```typescript
export interface RatingSummary {
  productId: number;
  rating: number;      // average rating
  totalRatings: number;
}

export interface UserRating {
  productId: number;
  rating: number;
  comment: string;
}
```

**File:** `packages/shared/api-types/src/index.ts` - add export

### 1.2 Data Layer (`@tusky/data-ratings`)

**Create:** `packages/backend/data-ratings/`

**File:** `src/lib/ratings.repository.ts`
- Static `UserRating[]` data (raw user ratings only)
- `findByProductId(productId: number): UserRating[]`
- No aggregation logic - just data access

### 1.3 Service Layer (`@tusky/service-ratings`)

**Create:** `packages/backend/service-ratings/`

**File:** `src/lib/ratings.service.ts`
- `getRatingSummary(productId: number): RatingSummary | undefined`
  - Calls repo.findByProductId()
  - **Calculates average rating** from raw ratings
  - **Counts total ratings**
  - Returns aggregated RatingSummary
- `getAllRatings(productId: number): UserRating[]`
  - Passes through from repository

### 1.4 API Layer (`@tusky/api-ratings`)

**Create:** `packages/backend/api-ratings/`

**File:** `src/lib/ratings.routes.ts`
- `GET /api/ratings/:productId` → returns `RatingSummary`
- `GET /api/ratings/:productId/all` → returns `UserRating[]`
- Swagger schemas for both endpoints

**File:** `src/types/fastify-swagger.d.ts` (copy from api-products)

### 1.5 Register Routes

**File:** `apps/api/src/app/app.ts`
- Import and register `ratingsRoutes`

---

## PHASE 2: Frontend

### 2.1 Data Access (`@tusky/data-access-ratings`)

**Create:** `packages/frontend/ratings/data-access-ratings/`

**File:** `src/lib/data-access-ratings.ts`
```typescript
export async function getRatingSummary(productId: number): Promise<RatingSummary>
export async function getAllRatings(productId: number): Promise<UserRating[]>
```

### 2.2 Smart Rating Component (`@tusky/ui-ratings`)

**Create:** `packages/frontend/ratings/ui-ratings/`

**File:** `src/lib/ProductRating.tsx`
- Fetches `RatingSummary` for given productId
- Uses `Rating` from `@tusky/tusky-design`
- Props: `productId`, `onReviewCountClick?`

**File:** `src/lib/ReviewsModal.tsx`
- Simple modal for displaying reviews list
- Props: `isOpen`, `onClose`, `reviews: UserRating[]`

### 2.3 Integrate in ProductDetail

**File:** `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- Replace inline `<Rating>` with `<ProductRating>` smart component
- Add click handler to open modal with all reviews

---

## PHASE 3: Tusky-Design Updates

### 3.1 Half-Star Support

**File:** `packages/shared/tusky-design/src/lib/Rating/Rating.tsx`
- Add `StarHalf` icon from lucide-react
- Logic: full stars = floor(value), half star if decimal >= 0.25

### 3.2 Click Handler for Review Count

**File:** `packages/shared/tusky-design/src/lib/Rating/Rating.tsx`
- Add prop: `onReviewCountClick?: () => void`
- Wrap count in clickable button when handler provided

### 3.3 Reviews Modal in ProductDetail

**File:** `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- Add modal state + fetch reviews on click
- Display each review with `<Rating>` + comment

---

## Files Created/Modified

### New Packages (use Nx generators)
- `packages/backend/data-ratings`
- `packages/backend/service-ratings`
- `packages/backend/api-ratings`
- `packages/frontend/ratings/data-access-ratings`
- `packages/frontend/ratings/ui-ratings`

### Modified Files
- `packages/shared/api-types/src/index.ts`
- `packages/shared/api-types/src/lib/rating.dto.ts` (new)
- `packages/shared/tusky-design/src/lib/Rating/Rating.tsx`
- `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
- `packages/frontend/products/feat-product-detail/src/pages/ProductDetailPage.tsx`
- `apps/api/src/app/app.ts`

---

## Decisions Made

- UserRating: anonymous (no username/userId)
- Modal: created in ui-ratings (not tusky-design)
- Pagination: no pagination on /all endpoint
- Repository stores raw ratings, service calculates averages
