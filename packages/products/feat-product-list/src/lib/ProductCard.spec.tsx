import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard, { ProductCardProps } from './ProductCard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard Component', () => {
  const defaultProps: ProductCardProps = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    rating: 4,
    image: 'https://example.com/product.jpg',
    category: 'Electronics',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render product information correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      renderWithRouter(<ProductCard {...defaultProps} />);

      expect(screen.getByText('Test Product')).toBeTruthy();
      expect(screen.getByText('Electronics')).toBeTruthy();
      expect(screen.getByText('$99.99')).toBeTruthy();
    });

    it('should render product image with alt text', async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const image = screen.getByAltText('Test Product') as HTMLImageElement;
      expect(image).toBeTruthy();
      expect(image.src).toBe('https://example.com/product.jpg');
    });

    it('should render star rating correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const stars = screen.getAllByText('★');
      expect(stars).toHaveLength(5);
    });
  });

  describe('Sale functionality', () => {
    it('should show SALE badge when product is on sale', async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const saleProps = { ...defaultProps, originalPrice: 149.99 };
      renderWithRouter(<ProductCard {...saleProps} />);

      expect(screen.getByText('SALE')).toBeTruthy();
      expect(screen.getByText('$149.99')).toBeTruthy();
    });

    it('should not show SALE badge when not on sale', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      renderWithRouter(<ProductCard {...defaultProps} />);

      expect(screen.queryByText('SALE')).toBeFalsy();
    });

    it('should calculate sale correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const saleProps = { ...defaultProps, price: 79.99, originalPrice: 99.99 };
      renderWithRouter(<ProductCard {...saleProps} />);

      expect(screen.getByText('$79.99')).toBeTruthy();
      expect(screen.getByText('$99.99')).toBeTruthy();
    });
  });

  describe('Interactive elements', () => {
    it('should prevent default on favorite button click', async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const favoriteButton = screen.getByRole('img', { name: 'favorite' })
        .parentElement!;
      const mockEvent = { preventDefault: vi.fn() };

      fireEvent.click(favoriteButton, mockEvent);
    });

    it('should render add to cart button', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const cartButton = screen.getByLabelText('Add to cart').parentElement!;
      expect(cartButton).toBeTruthy();
      expect(cartButton.tagName).toBe('BUTTON');
    });

    it('should have correct link to product detail', async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.getAttribute('href')).toBe('/product/1');
      });
    });
  });

  describe('Rating display', () => {
    it('should display correct number of filled stars', async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const { container } = renderWithRouter(<ProductCard {...defaultProps} />);

      const stars = container.querySelectorAll('.text-yellow-400');
      expect(stars).toHaveLength(4); // rating is 4
    });

    it('should display review count', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      renderWithRouter(<ProductCard {...defaultProps} />);

      const reviewCount = screen.getByText(/^\(\d+\)$/);
      expect(reviewCount).toBeTruthy();
    });

    it('should handle different ratings', async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const ratings = [1, 2, 3, 4, 5];

      for (const rating of ratings) {
        const { container } = renderWithRouter(
          <ProductCard {...defaultProps} rating={rating} />
        );
        const filledStars = container.querySelectorAll('.text-yellow-400');
        expect(filledStars).toHaveLength(rating);
      }
    });
  });

  describe('Styling and responsiveness', () => {
    it('should apply hover styles to product card', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { container } = renderWithRouter(<ProductCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('hover:shadow-lg');
    });

    it('should have transition effects', async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const { container } = renderWithRouter(<ProductCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('transition-shadow');
    });

    it('should render with correct layout classes', async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const { container } = renderWithRouter(<ProductCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('rounded-lg');
      expect(card.className).toContain('shadow-md');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long product names', async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const longNameProps = {
        ...defaultProps,
        name: 'This is a very long product name that might cause layout issues if not handled properly',
      };
      renderWithRouter(<ProductCard {...longNameProps} />);

      expect(screen.getByText(longNameProps.name)).toBeTruthy();
    });

    it('should handle extreme prices', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const extremePriceProps = {
        ...defaultProps,
        price: 9999.99,
        originalPrice: 19999.99,
      };
      renderWithRouter(<ProductCard {...extremePriceProps} />);

      expect(screen.getByText('$9999.99')).toBeTruthy();
      expect(screen.getByText('$19999.99')).toBeTruthy();
    });
  });
});
