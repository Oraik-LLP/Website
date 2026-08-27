type QueryValue = string | string[] | undefined;

export function catchAllPath(url: string | undefined, query: Record<string, QueryValue>, prefix: string) {
  const pathname = String(url ?? '').split('?')[0];
  const marker = `/api/${prefix}/`;
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex >= 0) {
    const parts = pathname
      .slice(markerIndex + marker.length)
      .split('/')
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));
    if (parts[0] !== '[...path]') return parts;
  }
  const raw = query.path ?? query['...path'];
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return values.flatMap((value) => value.split('/')).filter(Boolean);
}
