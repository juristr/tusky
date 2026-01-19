# PRD: Login Feature

## Introduction

Cookie-based authentication for Tusky Shop with hardcoded credentials (admin/password). Enables internal team to access protected routes during demo/staging. Fastify backend sets signed cookies; React frontend manages auth state and route protection.

## Goals

- Protect product and rating routes behind authentication
- Provide simple login/logout flow for internal team
- Session-based auth (expires on browser close)
- Global 401 handling with redirect to login

## User Stories

### US-001: Backend cookie plugin

**Description:** As a developer, I need cookie support in Fastify so auth can use signed cookies.

**Acceptance Criteria:**

- [ ] Install `@fastify/cookie`
- [ ] Create `apps/api/src/app/plugins/cookie.ts` with secret for signing
- [ ] Register plugin in app
- [ ] Typecheck passes

### US-002: Backend auth plugin

**Description:** As a developer, I need an auth preHandler to protect routes.

**Acceptance Criteria:**

- [ ] Create `apps/api/src/app/plugins/auth.ts`
- [ ] Decorate fastify with `authenticate` preHandler
- [ ] Check signed cookie validity
- [ ] Return 401 if invalid/missing
- [ ] Typecheck passes

### US-003: Auth routes package

**Description:** As a user, I need login/logout/me endpoints to authenticate.

**Acceptance Criteria:**

- [ ] Generate `packages/backend/api-auth` lib
- [ ] `POST /api/auth/login` - validate admin/password, set signed cookie
- [ ] `POST /api/auth/logout` - clear cookie
- [ ] `GET /api/auth/me` - return user if valid cookie
- [ ] Auth routes registered without auth preHandler (public)
- [ ] Typecheck passes

### US-004: Protect existing routes

**Description:** As a developer, I need product and rating routes protected.

**Acceptance Criteria:**

- [ ] Wrap productsRoutes + ratingsRoutes with auth preHandler
- [ ] Update CORS with `credentials: true`
- [ ] Unauthenticated requests return 401
- [ ] Typecheck passes

### US-005: Shared auth types

**Description:** As a developer, I need shared types for auth API contract.

**Acceptance Criteria:**

- [ ] Create `packages/shared/api-types/src/lib/auth.dto.ts`
- [ ] Define `LoginRequest`, `LoginResponse`, `User` interfaces
- [ ] Export from package index
- [ ] Typecheck passes

### US-006: Data access auth package

**Description:** As a frontend developer, I need API functions for auth.

**Acceptance Criteria:**

- [ ] Generate `packages/frontend/auth/data-access-auth`
- [ ] Implement `login()`, `logout()`, `getMe()` functions
- [ ] All fetch calls use `credentials: 'include'`
- [ ] Typecheck passes

### US-007: Auth context and hooks

**Description:** As a frontend developer, I need auth state management.

**Acceptance Criteria:**

- [ ] Generate `packages/frontend/auth/util-auth`
- [ ] Create AuthContext + AuthProvider
- [ ] Create `useAuth()` hook exposing user, login, logout, isLoading
- [ ] Handle 401 globally (redirect to /login)
- [ ] Typecheck passes

### US-008: Login page

**Description:** As a user, I want a login form to authenticate.

**Acceptance Criteria:**

- [ ] Generate `packages/frontend/auth/feat-login`
- [ ] Create LoginPage with username/password form
- [ ] Submit calls login() and redirects to home on success
- [ ] Show error message on failure
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Protected route component

**Description:** As a developer, I need a component to protect frontend routes.

**Acceptance Criteria:**

- [ ] Create ProtectedRoute in util-auth
- [ ] Redirect to /login if not authenticated
- [ ] Show loading state while checking auth
- [ ] Typecheck passes

### US-010: Integrate auth in app

**Description:** As a developer, I need to wire auth into the shop app.

**Acceptance Criteria:**

- [ ] Wrap app in AuthProvider
- [ ] Add `/login` route → LoginPage
- [ ] Wrap existing routes in ProtectedRoute
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Update existing data-access packages

**Description:** As a developer, I need existing API calls to include credentials.

**Acceptance Criteria:**

- [ ] Add `credentials: 'include'` to data-access-products
- [ ] Add `credentials: 'include'` to data-access-ratings
- [ ] Typecheck passes

### US-012: Navbar auth UI

**Description:** As a user, I want to see my username and logout button.

**Acceptance Criteria:**

- [ ] Use `useAuth()` in Navbar
- [ ] Show username when logged in
- [ ] Show logout button that calls logout()
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: `POST /api/auth/login` accepts `{username, password}`, validates against hardcoded admin/password, sets signed session cookie
- FR-2: `POST /api/auth/logout` clears auth cookie
- FR-3: `GET /api/auth/me` returns `{username}` if authenticated, 401 otherwise
- FR-4: Products and ratings routes return 401 without valid cookie
- FR-5: Auth routes are public (no auth required)
- FR-6: Frontend redirects to /login on 401 response
- FR-7: Session cookie expires on browser close (no maxAge)
- FR-8: CORS configured with `credentials: true`

## Non-Goals

- User registration or sign-up flow
- Password reset functionality
- Multiple user accounts
- Role-based permissions/authorization
- OAuth/SSO integration
- Remember me / persistent sessions
- Rate limiting or account lockout
- Specific error messages (wrong password vs user not found)

## Technical Considerations

- Use `@fastify/cookie` with signed cookies for security
- Cookie secret stored in plugin (hardcoded for demo)
- Frontend auth state managed via React Context
- Follow existing plugin pattern in `apps/api/src/app/plugins/sensible.ts`
- Generate new packages using Nx generators

## Success Metrics

- Internal team can login with admin/password
- Protected routes inaccessible without auth
- Page refresh maintains logged-in state
- Logout clears session and redirects to login

## Open Questions

None - scope explicitly limited to demo/staging use.
