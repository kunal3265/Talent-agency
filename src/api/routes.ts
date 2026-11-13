import { Hono, type Env } from 'hono'

import { TALENT } from '../data'
import { validateEnquiry, validateSubmission, validateSubscribe, type FieldErrors } from '../shared/validation'

// The form API, shared by the Cloudflare Worker (src/worker) and the Vercel
// functions (api/), so both hosts validate and answer identically. Each route
// validates its input and returns a reference; connect them to email, a CRM or
// a database to keep the bookings and submissions.

const reference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const invalid = (fieldErrors: FieldErrors) => json({ error: 'Please check the highlighted fields.', fieldErrors }, 422)
const badJson = () => json({ error: 'Send a JSON object.' }, 400)

export function createApi<E extends Env = Env>() {
  const app = new Hono<E>()

  app.get('/api/health', (c) => c.json({ ok: true }))

  app.get('/api/talent', (c) =>
    c.json({ talent: TALENT.map(({ slug, name, division, role, base, availability }) => ({ slug, name, division, role, base, availability })) }),
  )

  app.post('/api/enquiries', async (c) => {
    const body = await readBody(c.req.raw)
    if (!body) return badJson()
    const errors = validateEnquiry(body)
    if (Object.keys(errors).length) return invalid(errors)
    return c.json({ ok: true, reference: reference('BK') }, 201)
  })

  app.post('/api/submissions', async (c) => {
    const body = await readBody(c.req.raw)
    if (!body) return badJson()
    const errors = validateSubmission(body)
    if (Object.keys(errors).length) return invalid(errors)
    return c.json({ ok: true, reference: reference('SB') }, 201)
  })

  app.post('/api/subscribe', async (c) => {
    const body = await readBody(c.req.raw)
    if (!body) return badJson()
    const errors = validateSubscribe(body)
    if (Object.keys(errors).length) return invalid(errors)
    return c.json({ ok: true }, 201)
  })

  app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

  return app
}
