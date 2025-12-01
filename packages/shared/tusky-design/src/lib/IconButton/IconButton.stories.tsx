import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, within } from 'storybook/test';
import { Heart, Share2 } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Favorite: Story = {
  args: {
    icon: <Heart className="w-5 h-5" />,
    'aria-label': 'Add to favorites',
  },
};

export const FavoriteActive: Story = {
  args: {
    icon: <Heart className="w-5 h-5 fill-current" />,
    active: true,
    'aria-label': 'Remove from favorites',
  },
};

export const WithLabel: Story = {
  args: {
    icon: <Heart className="w-5 h-5" />,
    label: 'Add to Wishlist',
  },
};

export const Share: Story = {
  args: {
    icon: <Share2 className="w-5 h-5" />,
    label: 'Share',
  },
};

export const ClickTest: Story = {
  args: {
    icon: <Heart className="w-5 h-5" />,
    'aria-label': 'Favorite',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const ActiveStateTest: Story = {
  args: {
    icon: <Heart className="w-5 h-5" />,
    active: true,
    'aria-label': 'Active favorite',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toHaveClass('text-red-500');
  },
};
