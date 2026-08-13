let csrfToken = '';

export function setEngineCsrf(value: string) {
  csrfToken = value;
}

export async function engineApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = init.method ?? 'GET';
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof Blob)) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD'].includes(method)) headers.set('x-engine-csrf', csrfToken);
  const response = await fetch(`/api/engine/${path}`, { ...init, headers, credentials: 'same-origin' });
  if (response.status === 401) {
    window.dispatchEvent(new Event('engine:unauthorized'));
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? `Request failed (${response.status})`);
  return body as T;
}

export async function jsonMutation<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown) {
  return engineApi<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
}

