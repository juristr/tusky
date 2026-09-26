import { LoginRequest, LoginResponse, User } from '@tusky/api-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
}

export async function getMe(): Promise<{ user: User } | null> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    credentials: 'include',
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
