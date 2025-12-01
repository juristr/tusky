import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['sale', 'discount', 'info'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sale: Story = {
  args: { variant: 'sale', children: 'SALE' },
};

export const Discount: Story = {
  args: { variant: 'discount', children: '20% off' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'New' },
};

export const RenderTest: Story = {
  args: { variant: 'sale', children: 'SALE' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText('SALE');
    await expect(badge).toBeInTheDocument();
    await expect(badge).toHaveClass('bg-red-500');
  },
};
