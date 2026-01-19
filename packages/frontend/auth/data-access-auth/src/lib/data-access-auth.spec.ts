import { login, logout, getMe } from './data-access-auth.js';

describe('data-access-auth', () => {
  it('exports login, logout, getMe functions', () => {
    expect(typeof login).toBe('function');
    expect(typeof logout).toBe('function');
    expect(typeof getMe).toBe('function');
  });
});
