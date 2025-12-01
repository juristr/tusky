import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'icon'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary Button' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger Button' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost Button' },
};

export const Icon: Story = {
  args: {
    variant: 'icon',
    children: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m7.5-5v0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"
        />
      </svg>
    ),
    'aria-label': 'Add to cart',
  },
};

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Small Button' },
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Large Button' },
};

export const WithLeftIcon: Story = {
  args: {
    variant: 'secondary',
    children: 'Add to Cart',
    leftIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m7.5-5v0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"
        />
      </svg>
    ),
  },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Disabled', disabled: true },
};

export const ClickTest: Story = {
  args: { variant: 'primary', children: 'Click me' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
