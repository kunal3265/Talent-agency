import { handle } from 'hono/vercel'

import { createApi } from '../src/api/routes'

// Vercel Edge Function: the same handlers the Cloudflare Worker runs.
export const config = { runtime: 'edge' }

export default handle(createApi())
