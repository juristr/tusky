import { Product } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    window.location.href = '/login';
  }
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`, {
    credentials: 'include',
  });
  handleUnauthorized(res);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    credentials: 'include',
  });
  handleUnauthorized(res);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export type { Product };
