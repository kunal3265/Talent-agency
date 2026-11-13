import { createApi } from '../api/routes'

// The Worker in front of the static site: the shared form API, then the built
// assets (single-page-application mode). The same routes also run as Vercel
// Edge Functions in api/, so the forms work on either host.
type Env = {
  ASSETS: Fetcher
}

const app = createApi<{ Bindings: Env }>()

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
