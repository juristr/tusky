import { ProductRating, UserRating } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getRatingByProductId(
  productId: number
): Promise<ProductRating | undefined> {
  const res = await fetch(`${API_BASE}/api/ratings/${productId}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch rating');
  return res.json();
}

export async function getAllRatingsByProductId(
  productId: number
): Promise<UserRating[]> {
  const res = await fetch(`${API_BASE}/api/ratings/${productId}/all`);
  if (!res.ok) throw new Error('Failed to fetch ratings');
  return res.json();
}

export type { ProductRating, UserRating };
