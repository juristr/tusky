import { ProductRating } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getRatingByProductId(
  productId: number
): Promise<ProductRating | undefined> {
  const res = await fetch(`${API_BASE}/api/ratings/${productId}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch rating');
  return res.json();
}
