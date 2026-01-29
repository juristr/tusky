# Login Feature Implementation Plan

## Overview

Cookie-based auth w/ hardcoded credentials (admin/password). Fastify backend + React frontend.

---

## PHASE 1: Backend ✔︎

### 1.1 Install deps ✔︎

```bash
pnpm add @fastify/cookie
```

### 1.2 Create plugins ✔︎

**File:** `apps/api/src/app/plugins/cookie.ts`

- Register @fastify/cookie w/ secret for signing

**File:** `apps/api/src/app/plugins/auth.ts`

- Decorate `authenticate` preHandler
- Check signed cookie, return 401 if invalid

### 1.3 Create auth package ✔︎

Generate: `nx g @nx/js:lib api-auth --directory=packages/backend/api-auth --bundler=tsc`

**File:** `packages/backend/api-auth/src/lib/auth.routes.ts`

- `POST /api/auth/login` - validate creds, set signed cookie
- `POST /api/auth/logout` - clear cookie
- `GET /api/auth/me` - return user if valid cookie

### 1.4 Update app.ts ✔︎

**File:** `apps/api/src/app/app.ts`

- Register authRoutes (public, no auth required)
- Wrap productsRoutes + ratingsRoutes in scoped plugin w/ `authenticate` preHandler
- Update CORS: `credentials: true`

---

## PHASE 2: Shared Types ✔︎

**File:** `packages/shared/api-types/src/lib/auth.dto.ts`

```typescript
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  user: { username: string };
}
export interface User {
  username: string;
}
```

**File:** `packages/shared/api-types/src/index.ts` - add export

---

## PHASE 3: Frontend ✔︎

### 3.1 Create auth packages ✔︎

```bash
nx g @nx/react:lib data-access-auth --directory=packages/frontend/auth/data-access-auth
nx g @nx/react:lib util-auth --directory=packages/frontend/auth/util-auth
nx g @nx/react:lib feat-login --directory=packages/frontend/auth/feat-login
```

### 3.2 Implement packages ✔︎

**Package:** `data-access-auth/`

- login(), logout(), getMe()
- All fetch calls use `credentials: 'include'`

**Package:** `util-auth/`

- AuthContext + AuthProvider + useAuth hook
- ProtectedRoute component (redirect to /login if no user)

**Package:** `feat-login/`

- LoginPage component w/ form

### 3.3 Update app.tsx ✔︎

**File:** `apps/shop/src/app.tsx`

- Wrap app in AuthProvider
- Add `/login` route → LoginPage
- Wrap existing routes in ProtectedRoute

### 3.4 Update existing data-access ✔︎

Add `credentials: 'include'` to all fetch calls:

- `packages/frontend/products/data-access-products/src/lib/data-access-products.ts`
- `packages/frontend/ratings/data-access-ratings/src/lib/data-access-ratings.ts`

### 3.5 Update Navbar ✔︎

**File:** `apps/shop/src/components/Navbar.tsx`

- Use useAuth() to get user + logout
- Show username + logout button when logged in
- Handle 401 globally in AuthContext (redirect to /login)

---

## Verification ✔︎

1. Unit tests: `nx run-many -t test` ✔︎
2. E2E tests: `nx run-many -t e2e`
3. Lint: `nx run-many -t lint` ✔︎
4. Chrome DevTools MCP:
   - Navigate to app → redirect to /login
   - Login admin/password → see products
   - Refresh → stay logged in
   - Logout → redirect to /login

---

## Git Workflow

1. `git checkout -b feature/login`
2. Commits:
   - "feat(api): add cookie + auth plugins"
   - "feat(api): add auth routes"
   - "feat(shared): add auth types"
   - "feat(frontend): add auth packages"
   - "feat(shop): integrate auth + protect routes"
3. `gh pr create`

---

## Critical Files

- `apps/api/src/app/app.ts`
- `apps/api/src/app/plugins/sensible.ts` (pattern reference)
- `apps/shop/src/app.tsx`
- `apps/shop/src/components/Navbar.tsx`
- `packages/frontend/products/data-access-products/src/lib/data-access-products.ts`
- `packages/shared/api-types/src/index.ts`

---

## Decisions

- Cookie: session cookie (no maxAge, expires on browser close)
- Navbar: show username + logout button
- 401 handling: global redirect via AuthContext
