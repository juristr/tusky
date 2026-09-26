import { RatingSummary, UserRating } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    window.location.href = '/login';
  }
}

export async function getRatingSummary(
  productId: number
): Promise<RatingSummary | undefined> {
  const res = await fetch(`${API_BASE}/api/ratings/${productId}`, {
    credentials: 'include',
  });
  handleUnauthorized(res);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch rating summary');
  return res.json();
}

export async function getAllRatings(productId: number): Promise<UserRating[]> {
  const res = await fetch(`${API_BASE}/api/ratings/${productId}/all`, {
    credentials: 'include',
  });
  handleUnauthorized(res);
  if (!res.ok) throw new Error('Failed to fetch ratings');
  return res.json();
}

export type { RatingSummary, UserRating };
