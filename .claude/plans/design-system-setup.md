# Design System Component Extraction Plan

## Goal

Extract atomic components from existing codebase into `@tusky/tusky-design` library with Storybook stories and interaction tests.

## Target Library

`packages/shared/tusky-design/` - Storybook 10.1.0 + React 19 + Vite already configured

---

# Phase 1: Button Component

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

### Steps

1. Create `packages/shared/tusky-design/src/lib/Button/` folder
2. Implement `Button.tsx` with all variants
3. Create `Button.stories.tsx` with stories for each variant
4. Add interaction test (click handler verification)
5. Export from `index.ts`
6. Verify with `pnpm nx storybook tusky-design`

---

# Phase 2: Badge Component

## 2. Badge

**Source patterns:**

- `ProductCard.tsx:39-42` - SALE badge
- `ProductDetail.tsx:107-109` - discount percentage badge

**Variants:**

- `sale` - red bg
- `discount` - green text
- `info` - gray bg

**Props:** `variant`, `children`

### Steps

1. Create `packages/shared/tusky-design/src/lib/Badge/` folder
2. Implement `Badge.tsx` with all variants
3. Create `Badge.stories.tsx` with stories for each variant
4. Add interaction test (render verification)
5. Export from `index.ts`
6. Verify with `pnpm nx storybook tusky-design`

---

# Phase 3: Rating Component

## 3. Rating

**Source patterns:**

- `ProductCard.tsx:55-67` - star rating display
- `ProductDetail.tsx:77-93` - star rating with review count

**Props:** `value` (0-5), `showCount`, `count`, `size`

### Steps

1. Create `packages/shared/tusky-design/src/lib/Rating/` folder
2. Implement `Rating.tsx` with star display logic
3. Create `Rating.stories.tsx` with various rating values
4. Add interaction test (correct star rendering)
5. Export from `index.ts`
6. Verify with `pnpm nx storybook tusky-design`

---

# Phase 4: Price Component

## 4. Price

**Source patterns:**

- `ProductCard.tsx:70-76` - price with strikethrough
- `ProductDetail.tsx:97-113` - price with discount percentage

**Props:** `price`, `originalPrice`, `showDiscount`, `size`

### Steps

1. Create `packages/shared/tusky-design/src/lib/Price/` folder
2. Implement `Price.tsx` with sale/discount logic
3. Create `Price.stories.tsx` with regular and sale prices
4. Add interaction test (correct price formatting)
5. Export from `index.ts`
6. Verify with `pnpm nx storybook tusky-design`

---

# Phase 5: IconButton Component

## 5. IconButton

**Source patterns:**

- `ProductCard.tsx:30-38` - favorite button
- `ProductDetail.tsx:175-183` - wishlist/share buttons

**Props:** `icon`, `label`, `onClick`, `active`

### Steps

1. Create `packages/shared/tusky-design/src/lib/IconButton/` folder
2. Implement `IconButton.tsx` with active state
3. Create `IconButton.stories.tsx` with different icons
4. Add interaction test (click and active state)
5. Export from `index.ts`
6. Verify with `pnpm nx storybook tusky-design`

---

# Phase 6: Refactor Existing Components

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
5. Run `pnpm nx format:write`

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

## Dependencies to Add

- `clsx` for class merging (add to tusky-design)
- `lucide-react` for icons (already in project)

## Critical Files

- `packages/shared/tusky-design/.storybook/main.ts`
- `packages/shared/tusky-design/.storybook/preview.ts`
- `packages/shared/tusky-design/src/index.ts`
- `packages/frontend/products/feat-product-list/src/lib/ProductCard.tsx`
- `packages/frontend/products/feat-product-detail/src/lib/ProductDetail.tsx`
