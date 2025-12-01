import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Price } from './Price';

const meta = {
  title: 'Atoms/Price',
  component: Price,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: { price: 29.99 },
};

export const OnSale: Story = {
  args: { price: 19.99, originalPrice: 29.99 },
};

export const WithDiscount: Story = {
  args: { price: 19.99, originalPrice: 29.99, showDiscount: true },
};

export const Small: Story = {
  args: { price: 9.99, size: 'sm' },
};

export const Large: Story = {
  args: { price: 99.99, originalPrice: 149.99, showDiscount: true, size: 'lg' },
};

export const HighDiscount: Story = {
  args: { price: 25.0, originalPrice: 100.0, showDiscount: true },
};

export const PriceFormatTest: Story = {
  args: { price: 19.99, originalPrice: 29.99, showDiscount: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentPrice = canvas.getByTestId('current-price');
    const originalPrice = canvas.getByTestId('original-price');
    const discount = canvas.getByTestId('discount-badge');

    await expect(currentPrice).toHaveTextContent('$19.99');
    await expect(originalPrice).toHaveTextContent('$29.99');
    await expect(discount).toHaveTextContent('33% off');
  },
};
