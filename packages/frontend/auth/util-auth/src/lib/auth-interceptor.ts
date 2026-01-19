/**
 * Setup global fetch interceptor to redirect to /login on 401 responses.
 * Call this once at app initialization.
 */
export function setupAuthInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 401) {
      const input = args[0];
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      // Don't redirect if already on auth routes
      if (!url.includes('/api/auth/')) {
        window.location.href = '/login';
      }
    }

    return response;
  };
}
