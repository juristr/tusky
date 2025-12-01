# Design System Component Extraction Plan

## Goal

Extract atomic components from existing codebase into `@tusky/tusky-design` library with Storybook stories and interaction tests.

## Target Library

`packages/shared/tusky-design/` - Storybook 10.1.0 + React 19 + Vite already configured

## Progress Summary

| Phase | Component   | Status  | Stories | Tests |
| ----- | ----------- | ------- | ------- | ----- |
| 1     | Button      | DONE    | 10      | pass  |
| 2     | Badge       | DONE    | 4       | pass  |
| 3     | Rating      | DONE    | 8       | pass  |
| 4     | Price       | DONE    | 7       | pass  |
| 5     | IconButton  | DONE    | 6       | pass  |
| 6     | Refactoring | PENDING | -       | -     |

**Total: 35 Storybook tests passing**

**Branch:** `build-design-system`

---

# Phase 1: Button Component - DONE

## 1. Button

**Source patterns:**

- `ProductCard.tsx:79-96` - icon button (add to cart)
- `ProductDetail.tsx:160-170` - primary/secondary buttons

**Variants:**

- `primary` - indigo-600 bg
- `secondary` - yellow-400 bg
- `danger` - orange-500 bg
- `ghost` - transparent, text only
- `icon` - circular, icon-only

**Props:** `variant`, `size`, `disabled`, `children`, `leftIcon`, `rightIcon`, `onClick`

**Commit:** `4c3e709 feat(tusky-design): add Button component w/ variants`

---

# Phase 2: Badge Component - DONE

## 2. Badge

**Source patterns:**

- `ProductCard.tsx:39-42` - SALE badge
- `ProductDetail.tsx:107-109` - discount percentage badge

**Variants:**

- `sale` - red bg
- `discount` - green text
- `info` - gray bg

**Props:** `variant`, `children`

**Commit:** `faf8f80 feat(tusky-design): add Badge component`

---

# Phase 3: Rating Component - DONE

## 3. Rating

**Source patterns:**

- `ProductCard.tsx:55-67` - star rating display
- `ProductDetail.tsx:77-93` - star rating with review count

**Props:** `value` (0-5), `showCount`, `count`, `size`

**Implementation notes:**

- Uses `lucide-react` Star icon
- Sizes: sm/md/lg

**Commit:** `2231706 feat(tusky-design): add Rating component`

---

# Phase 4: Price Component - DONE

## 4. Price

**Source patterns:**

- `ProductCard.tsx:70-76` - price with strikethrough
- `ProductDetail.tsx:97-113` - price with discount percentage

**Props:** `price`, `originalPrice`, `showDiscount`, `size`

**Commit:** `6a9e1fd feat(tusky-design): add Price component`

---

# Phase 5: IconButton Component - DONE

## 5. IconButton

**Source patterns:**

- `ProductCard.tsx:30-38` - favorite button
- `ProductDetail.tsx:175-183` - wishlist/share buttons

**Props:** `icon`, `label`, `onClick`, `active`

**Commit:** `e41d148 feat(tusky-design): add IconButton component`

---

# Phase 6: Refactor Existing Components - PENDING

## Refactoring Plan

### Package Dependencies to Update

Add `"@tusky/tusky-design": "workspace:*"` to:

- `packages/frontend/products/feat-product-list/package.json`
- `packages/frontend/products/feat-product-detail/package.json`

### ProductCard.tsx Refactoring

Replace inline implementations with:

- `<IconButton>` for favorite button (line 30-38)
- `<Badge variant="sale">` for SALE badge (line 39-42)
- `<Rating>` for star display (line 55-67)
- `<Price>` for price display (line 70-76)
- `<Button variant="icon">` for add-to-cart (line 79-96)

### ProductDetail.tsx Refactoring

Replace inline implementations with:

- `<Rating>` for star display (line 77-93)
- `<Price>` for price display (line 97-113)
- `<Button>` for Add to Cart/Buy Now (line 160-170)
- `<IconButton>` for wishlist/share (line 175-183)

### Steps

1. Add `@tusky/tusky-design` dependency to both packages
2. Refactor `ProductCard.tsx` to use design system components
3. Refactor `ProductDetail.tsx` to use design system components
4. Run existing tests to verify no regressions
5. Run `pnpm nx run-many -t build test lint` - ensure CI checks pass
6. Run `pnpm nx format:write`

---

# Reference

## File Structure

```
packages/shared/tusky-design/src/
├── index.ts
└── lib/
    ├── Button/
    │   ├── Button.tsx
    │   ├── Button.stories.tsx
    │   └── index.ts
    ├── Badge/
    │   ├── Badge.tsx
    │   ├── Badge.stories.tsx
    │   └── index.ts
    ├── Rating/
    │   ├── Rating.tsx
    │   ├── Rating.stories.tsx
    │   └── index.ts
    ├── Price/
    │   ├── Price.tsx
    │   ├── Price.stories.tsx
    │   └── index.ts
    └── IconButton/
        ├── IconButton.tsx
        ├── IconButton.stories.tsx
        └── index.ts
```

## Story Pattern (Storybook 10)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
};

// Interaction test
export const ClickTest: Story = {
  args: { variant: 'primary', children: 'Click me' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

## Styling Approach

- Tailwind CSS (already in use across codebase)
- Use `clsx` for conditional classes

## Dependencies Added

- `clsx` added to tusky-design package.json
- `lucide-react` already in project (used by Rating, IconButton)

## Critical Files

- `packages/shared/tusky-design/.storybook/main.ts`
- `packages/shared/tusky-design/.storybook/preview.ts`
- `packages/shared/tusky-design/src/index.ts`
- `packages/frontend/products/feat-product-list/src/lib/ProductCard.tsx`
- `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`

## Known Issues / Notes

- Storybook cache sometimes causes flaky tests when adding new deps (lucide-react). Fix: `rm -rf node_modules/.cache/storybook` and rerun.
- One pre-existing lint warning in `.storybook/main.ts` (no-explicit-any) - not related to design system work.
