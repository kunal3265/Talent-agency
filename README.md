# Bravura Talent: talent agency site

A dark, cinematic site for a talent agency, built as a template you can rebrand
and ship: a full-bleed logotype hero over a glass-winged dragonfly render with a
running timecode and camera HUD, a filterable roster that remembers your view,
artist profiles with reel and credits, a work list, a journal, a three-step
representation form, booking enquiries and a saved shortlist.

**[Live demo](https://bravura-agency.vercel.app/)**

## What this is

A complete agency front end — every screen built, real interaction states and a
design system you can inspect page by page — with no database or CMS behind it:

- **Static first.** `npm run build:html` compiles the whole site into one
  double-clickable `dist-static/index.html` with the JS and CSS inlined and the
  images in a folder beside it. That build switches to hash routing, so every
  route works when opened straight from disk, not just from a server.
- **Forms validated twice.** The same rules in `src/shared/validation.ts` run in
  the browser and on the server: 422 with per-field errors, 400 for malformed
  JSON, and a booking or submission reference back for valid input.
- **Two interchangeable APIs.** One Hono app in `src/api/routes.ts` is mounted
  both as a Cloudflare Worker and as five Vercel Edge Functions, so the forms
  work on whichever host you deploy to.
- **Nothing is stored.** Submissions are validated and acknowledged, then
  dropped — no database, no email, no CRM. The routes are the place to plug one
  in.
- **Placeholder media.** Every person, credit, production and photograph is
  fictional; the images are generated stand-ins you can swap out.

## Run it

```sh
bun install        # or: npm install
bun run dev        # http://localhost:5304 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/talent_agency/index.js (Worker)
```

On npm, substitute `npm run …` and use `npm run build:html` for the single-file
build, which does not start a server.

## Screens

| Route | What it is |
| --- | --- |
| `/` | Hero, intro and stats, featured talent, selected work, services, journal, call to action |
| `/talent` | Roster: division chips, search, availability, sort, grid or list (view and sort are remembered) |
| `/talent/:slug` | Profile: portrait, quote, stats, bio, facts, agent, reel player, credits, booking dialog |
| `/work` | Productions by format and status |
| `/about` | Story, rules, timeline, agents, offices |
| `/journal`, `/journal/:slug` | News and advice with categories, articles with copy link |
| `/join` | Three-step submission for representation; the draft survives a reload until sent |
| `/contact` | Booking enquiry (prefill talent with `?talent=slug,slug`), offices with local time |
| `/shortlist` | Saved artists (localStorage) sent as one brief |
| `/styleguide` | Every token and component in every state |
| anything else | 404 |

## Edit it

- `src/data.ts` holds every string, the roster, work, journal, agents, offices
  and form options. Start there.
- **Photography**: every image goes through `PHOTOS` in `src/data.ts` (keys are
  talent slugs, `agent-<slug>`, project slugs and post slugs). The shipped
  images in `public/images/` are generated placeholders of fictional people and
  scenes; point an entry at your own photograph to replace it, or delete the
  entry to fall back to drawn duotone art. `HERO_RENDER` is the hero dragonfly;
  set it to `null` to use the animated SVG one in `src/components/Dragonfly.tsx`.
- `src/styles.css` holds the tokens (colours, radii, fonts, keyframes) and the
  `hover-f`/`focus-f`/`active-f` variants that let the style guide pin states
  with `data-force`. Everything rounded is a squircle; true circles use `.round`.
- `src/components/` is the design system, `src/pages/` the screens. See it all
  at [`/styleguide`](http://localhost:5304/styleguide).
- `src/shared/validation.ts` validates the forms in the browser and in the Worker.
- `src/worker/index.ts` is the Cloudflare Worker: `GET /api/health`,
  `GET /api/talent`, `POST /api/enquiries`, `POST /api/submissions`,
  `POST /api/subscribe`. They validate (422 with field errors, 400 for bad JSON)
  and return a reference; connect them to email, a CRM or a D1 table to keep
  what is sent. Unknown `/api/*` routes return a JSON 404.
- `api/` exposes the same routes as Vercel Edge Functions (through
  `hono/vercel`), sharing `src/api/routes.ts` with the Worker, so the forms
  also work when the static build is hosted on Vercel. `vercel.json` builds
  `dist-static` with `npm run build:html`.

## Stack

- React + TypeScript on Vite, with hash routing in the static build.
- Tailwind for the design-system classes alongside the tokens in `src/styles.css`.
- Hono for the API, mounted as a Cloudflare Worker and as Vercel Edge Functions.

<details><summary>Dependencies</summary>

```
@cloudflare/vite-plugin
@cloudflare/workers-types
@tailwindcss/vite
@types/react
@types/react-dom
@vitejs/plugin-react
hono
lucide-react
motion
react
react-dom
react-router
tailwindcss
typescript
vite
wrangler
```

</details>

## Deploy

| Target | Build | Serves |
| --- | --- | --- |
| Vercel | `npm run build:html` (from `vercel.json`) | `dist-static` plus the functions in `api/` |
| Cloudflare | `npm run build` | `dist/client` assets plus the Worker, per `deploy.json` |
