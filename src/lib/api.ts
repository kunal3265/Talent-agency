export type ApiResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

/** POST JSON to a worker route and normalise the response. */
const STATIC_FILE = typeof window !== 'undefined' && window.location.protocol === 'file:'

// Opened straight from disk there is no Worker to answer, so acknowledge the
// shapes it returns and keep the demo usable.
function staticPost<T>(url: string): ApiResult<T> {
  const prefix = url.includes('enquiries') ? 'BK' : url.includes('submissions') ? 'SB' : ''
  const reference = `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  return { ok: true, data: (prefix ? { ok: true, reference } : { ok: true }) as T }
}

export async function postJson<T = unknown>(url: string, body: unknown): Promise<ApiResult<T>> {
  if (STATIC_FILE) return staticPost<T>(url)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        error: typeof json.error === 'string' ? json.error : 'Something went wrong. Please try again.',
        fieldErrors: (json.fieldErrors as Record<string, string>) ?? undefined,
      }
    }
    return { ok: true, data: json as T }
  } catch {
    return { ok: false, error: 'We could not reach the server. Check your connection and try again.' }
  }
}
