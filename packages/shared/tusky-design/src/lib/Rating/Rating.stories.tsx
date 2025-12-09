import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  title: 'Atoms/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveStars: Story = {
  args: { value: 5 },
};

export const FourStars: Story = {
  args: { value: 4 },
};

export const ThreeStars: Story = {
  args: { value: 3 },
};

export const WithCount: Story = {
  args: { value: 4.5, showCount: true, count: 128 },
};

export const Small: Story = {
  args: { value: 4, size: 'sm' },
};

export const Large: Story = {
  args: { value: 4, size: 'lg' },
};

export const ZeroStars: Story = {
  args: { value: 0 },
};

export const HalfStar: Story = {
  args: { value: 3.5 },
};

export const FourAndHalf: Story = {
  args: { value: 4.5 },
};

export const StarRenderTest: Story = {
  args: { value: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const filledStars = canvas.getAllByTestId('star-filled');
    const emptyStars = canvas.getAllByTestId('star-empty');
    await expect(filledStars).toHaveLength(3);
    await expect(emptyStars).toHaveLength(2);
  },
};

export const HalfStarRenderTest: Story = {
  args: { value: 3.7 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const filledStars = canvas.getAllByTestId('star-filled');
    const halfStar = canvas.getByTestId('star-half');
    const emptyStars = canvas.getAllByTestId('star-empty');
    await expect(filledStars).toHaveLength(3);
    await expect(halfStar).toBeInTheDocument();
    await expect(emptyStars).toHaveLength(1);
  },
};
