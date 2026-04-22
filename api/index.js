import app from '../server/index.js';

function toQueryString(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, String(v));
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export default function handler(req, res) {
  // With `vercel.json` rewrite `/api/:path* -> /api`, Vercel passes the original
  // path as a query param named `path`. Reconstruct the original URL so Express
  // can match routes like `/api/projects/:id`.
  const pathParam = req?.query?.path;
  const pathValue = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam || '').trim();

  if (pathValue) {
    const nextQuery = { ...(req.query || {}) };
    delete nextQuery.path;
    req.url = `/api/${pathValue}${toQueryString(nextQuery)}`;
  }

  return app(req, res);
}

