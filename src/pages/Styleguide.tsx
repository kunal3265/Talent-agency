import { ArrowRight, LayoutGrid, List, Plus, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { AvailabilityBadge, Badge, type BadgeTone } from '../components/Badge'
import { Button, IconButton, MicroLink, type ButtonVariant } from '../components/Button'
import { Chip } from '../components/Chip'
import { Dragonfly } from '../components/Dragonfly'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { FpsCounter, RecIndicator, Ruler, Sparkle, Timecode } from '../components/Hud'
import { Marquee } from '../components/Marquee'
import { Modal } from '../components/Modal'
import { NewsletterForm } from '../components/NewsletterForm'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { PostCard } from '../components/PostCard'
import { ReelPlayer } from '../components/ReelPlayer'
import { SaveButton } from '../components/SaveButton'
import { ScrollCue } from '../components/ScrollCue'
import { Segmented } from '../components/Segmented'
import { Stat } from '../components/Stat'
import { Stepper } from '../components/Stepper'
import { TalentCard } from '../components/TalentCard'
import { useToast } from '../components/Toast'
import { Wordmark } from '../components/Wordmark'
import { WorkRow } from '../components/WorkRow'
import { POSTS, TALENT, WORK } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Token tables mirror @theme in src/styles.css.
const COLORS = [
  { name: 'Void', token: '--color-void', hex: '#050506', use: 'Page background' },
  { name: 'Ink', token: '--color-ink', hex: '#0b0b0f', use: 'Panels, inputs' },
  { name: 'Panel', token: '--color-panel', hex: '#121218', use: 'Dialogs, focused inputs' },
  { name: 'Raised', token: '--color-raised', hex: '#1a1a22', use: 'Tokens inside panels' },
  { name: 'Bone', token: '--color-bone', hex: '#f1eee4', use: 'Logotype, headings, primary button' },
  { name: 'Foreground', token: '--color-fg', hex: '#e8e6e0', use: 'Body text' },
  { name: 'Muted', token: '--color-muted', hex: '#a3a1ab', use: 'Secondary text (AA)' },
  { name: 'Faint', token: '--color-faint', hex: '#6e6c76', use: 'Ruler numbers, placeholders only' },
  { name: 'Violet', token: '--color-violet', hex: '#8b6cff', use: 'Glows, fills, large type' },
  { name: 'Violet text', token: '--color-violet-text', hex: '#b09cff', use: 'Links, focus ring (AA)' },
  { name: 'Violet deep', token: '--color-violet-deep', hex: '#2a1d5c', use: 'Glow button, active step' },
  { name: 'Ultra', token: '--color-ultra', hex: '#6b63ff', use: 'Hand-drawn scribble (large only)' },
  { name: 'Acid', token: '--color-acid', hex: '#dff3b0', use: 'Glow inside the logotype' },
  { name: 'Success', token: '--color-success', hex: '#9fe0a8', use: 'Available, confirmations' },
  { name: 'Danger', token: '--color-danger', hex: '#ff8a80', use: 'Errors' },
]

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const TYPE = [
  { label: 'Logotype', spec: 'Archivo 900, fitted to width', node: <Wordmark text="BRAVURA" height={150} fontSize={210} /> },
  { label: 'Display XL', spec: 'clamp(3rem…7.5rem) / 0.86', node: <p className="display text-[clamp(3rem,1.6rem+5.6vw,7.5rem)] text-bone">World-makers</p> },
  { label: 'Display L', spec: 'clamp(2.5rem…5.5rem)', node: <p className="display text-[clamp(2.5rem,1.4rem+4.2vw,5.5rem)] text-bone">On the roster</p> },
  { label: 'Display M', spec: '28–40px', node: <p className="display text-[34px] text-bone">Ines Varga</p> },
  { label: 'Lead', spec: 'clamp(1.15rem…1.6rem)', node: <p className="text-[clamp(1.15rem,0.9rem+0.8vw,1.6rem)] leading-snug text-fg">Small lists, senior agents.</p> },
  { label: 'Body', spec: '17px / 1.6', node: <p className="text-[17px] leading-relaxed text-fg">We read the full script before we put anyone forward.</p> },
  { label: 'Small', spec: '14px', node: <p className="text-sm text-muted">Roles, dates, locations and anything we should know.</p> },
  { label: 'Micro', spec: '11px caps, wdth 88', node: <p className="micro text-fg">World-makers · Vision · Craft</p> },
  { label: 'Mono', spec: 'JetBrains Mono 11–12px', node: <p className="font-mono text-[12px] text-fg">00:00:03:18</p> },
  { label: 'Hand', spec: 'Permanent Marker', node: <p className="font-hand text-[34px] text-ultra">est. 09</p> },
]

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 112, 144]
const RADII = [
  { name: 'xs', value: 6 },
  { name: 'sm', value: 10 },
  { name: 'control', value: 12 },
  { name: 'md', value: 16 },
  { name: 'lg', value: 24 },
]
const SHADOWS = [
  { name: 'Glow', css: 'var(--shadow-glow)' },
  { name: 'Float', css: 'var(--shadow-float)' },
  { name: 'Hairline', css: 'inset 0 0 0 1px var(--color-line-strong)' },
]
const MOTION = [
  { name: 'Ease out expo', spec: 'cubic-bezier(0.22, 1, 0.36, 1), 700ms', kind: 'ease' },
  { name: 'Flutter', spec: 'flutter 3.2s ease-in-out infinite', kind: 'flutter' },
  { name: 'Hover', spec: 'hover 6s ease-in-out infinite', kind: 'hover' },
  { name: 'Blink', spec: 'blink 1.2s steps(2) infinite', kind: 'blink' },
  { name: 'Drift', spec: 'drift 9s alternate infinite', kind: 'drift' },
  { name: 'Page fade', spec: 'opacity 300ms on route change', kind: 'fade' },
] as const

const STATES = ['default', 'hover', 'focus', 'pressed', 'disabled', 'loading'] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line pt-10" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="display text-[clamp(2rem,1.4rem+2vw,3.4rem)] text-bone">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="micro text-muted">{label}</span>
      {children}
    </div>
  )
}

function MotionDemo({ kind, run }: { kind: (typeof MOTION)[number]['kind']; run: number }) {
  const box = 'size-10 rounded-[10px] bg-violet'
  if (kind === 'ease')
    return (
      <motion.div key={run} className={box} initial={{ x: 0 }} animate={{ x: 120 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
    )
  if (kind === 'fade') return <motion.div key={run} className={box} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
  const cls = { flutter: 'animate-flutter-r origin-left', hover: 'animate-hover', blink: 'animate-blink', drift: 'animate-drift' }[kind]
  return <div key={run} className={`${box} ${cls}`} />
}

export function Styleguide() {
  useDocumentTitle('Style guide')
  const [run, setRun] = useState(0)
  const [modal, setModal] = useState(false)
  const [seg, setSeg] = useState<'grid' | 'list'>('grid')
  const [chip, setChip] = useState(true)
  const toast = useToast()
  const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'glow']
  const nav = [
    ['colour', 'Colour'],
    ['type', 'Type'],
    ['space', 'Space, radii, shadow'],
    ['motion', 'Motion'],
    ['buttons', 'Buttons'],
    ['forms', 'Forms'],
    ['badges', 'Chips and badges'],
    ['cards', 'Cards'],
    ['media', 'Media'],
    ['hud', 'Hero and HUD'],
    ['feedback', 'Feedback'],
  ]

  return (
    <>
      <PageHeader
        word="SYSTEM"
        eyebrow="Style guide"
        title="Style guide"
        lead="Every token and component Bravura Talent is built from, rendered by the real components. States are pinned with data-force on the component itself. The site has one theme: dark."
      />
      <nav aria-label="Style guide sections" className="sticky top-14 z-30 -mt-4 mb-10 overflow-x-auto border-y border-line bg-void/85 px-4 backdrop-blur-xl md:top-[52px]">
        <ul className="flex gap-5 whitespace-nowrap">
          {nav.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="micro inline-flex min-h-11 min-w-10 items-center justify-center text-muted hover:text-bone">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-20 px-4">
        <Section id="colour" title="Colour">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {COLORS.map((c) => (
              <li key={c.token} className="panel overflow-hidden rounded-[var(--radius-md)]">
                <div className="h-20" style={{ background: c.hex, boxShadow: 'inset 0 -1px 0 var(--color-line)' }} />
                <div className="p-4">
                  <p className="font-semibold text-bone">{c.name}</p>
                  <p className="font-mono text-[12px] text-fg">{c.hex}</p>
                  <p className="font-mono text-[11px] text-muted">{c.token}</p>
                  <p className="mt-2 text-xs text-muted">{c.use}</p>
                  <p className="micro mt-2 text-muted">{contrast(c.hex, '#050506').toFixed(1)}:1 on void</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="type" title="Type">
          <p className="mb-6 text-sm text-muted">Archivo (variable width and weight) for everything set, JetBrains Mono for timecode, Permanent Marker for the hand-drawn marks.</p>
          <ul className="divide-y divide-line border-y border-line">
            {TYPE.map((t) => (
              <li key={t.label} className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-bone">{t.label}</p>
                  <p className="font-mono text-[11px] text-muted">{t.spec}</p>
                </div>
                <div className="min-w-0">{t.node}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="space" title="Space, radii, shadow">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <h3 className="micro mb-4 text-muted">Spacing (px)</h3>
              <ul className="space-y-2">
                {SPACING.map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="w-10 font-mono text-[11px] text-muted">{s}</span>
                    <span className="h-3 rounded-[3px] bg-violet" style={{ width: s }} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="micro mb-4 text-muted">Radii (squircle)</h3>
              <ul className="grid grid-cols-3 gap-4">
                {RADII.map((r) => (
                  <li key={r.name} className="flex flex-col items-center gap-2">
                    <span className="size-16 bg-raised shadow-[inset_0_0_0_1px_var(--color-line-strong)]" style={{ borderRadius: r.value }} />
                    <span className="font-mono text-[11px] text-muted">
                      {r.name} {r.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="micro mb-4 text-muted">Shadows</h3>
              <ul className="grid grid-cols-3 gap-4">
                {SHADOWS.map((s) => (
                  <li key={s.name} className="flex flex-col items-center gap-3">
                    <span className="size-16 rounded-[16px] bg-panel" style={{ boxShadow: s.css }} />
                    <span className="micro text-muted">{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="motion" title="Motion">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
              Replay
            </Button>
            <p className="text-sm text-muted">Non-essential motion stops when the visitor prefers reduced motion.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOTION.map((m) => (
              <li key={m.name} className="panel rounded-[var(--radius-md)] p-5">
                <p className="font-semibold text-bone">{m.name}</p>
                <p className="font-mono text-[11px] text-muted">{m.spec}</p>
                <div className="mt-5 h-12 overflow-hidden">
                  <MotionDemo kind={m.kind} run={run} />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="space-y-8">
            {variants.map((v) => (
              <div key={v}>
                <h3 className="micro mb-3 text-bone">{v}</h3>
                <div className="flex flex-wrap gap-6">
                  {STATES.map((s) => (
                    <Cell key={s} label={s}>
                      <Button
                        variant={v}
                        data-force={s === 'hover' || s === 'focus' || s === 'pressed' ? s : undefined}
                        disabled={s === 'disabled'}
                        loading={s === 'loading'}
                        iconRight={<ArrowRight className="size-4" aria-hidden />}
                      >
                        Book now
                      </Button>
                    </Cell>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-6">
              <Cell label="sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </Cell>
              <Cell label="icon button">
                <div className="flex gap-3">
                  <IconButton aria-label="Add">
                    <Plus className="size-4" aria-hidden />
                  </IconButton>
                  <IconButton aria-label="Add (hover)" data-force="hover">
                    <Plus className="size-4" aria-hidden />
                  </IconButton>
                  <IconButton aria-label="Add (focus)" data-force="focus">
                    <Plus className="size-4" aria-hidden />
                  </IconButton>
                  <IconButton aria-label="Add (disabled)" disabled>
                    <Plus className="size-4" aria-hidden />
                  </IconButton>
                </div>
              </Cell>
              <Cell label="micro link: default, hover, focus, current">
                <div className="flex gap-5">
                  <MicroLink to="/talent">Talent</MicroLink>
                  <MicroLink to="/talent" data-force="hover">
                    Talent
                  </MicroLink>
                  <MicroLink to="/talent" data-force="focus">
                    Talent
                  </MicroLink>
                  <MicroLink to="/styleguide" aria-current="page">
                    Talent
                  </MicroLink>
                </div>
              </Cell>
              <Cell label="shortlist toggle: default, hover, focus, labelled (click to toggle)">
                <div className="flex gap-3">
                  <SaveButton slug="ines-varga" name="Ines Varga" />
                  <SaveButton slug="ines-varga" name="Ines Varga" force="hover" />
                  <SaveButton slug="ines-varga" name="Ines Varga" force="focus" />
                  <SaveButton slug="ines-varga" name="Ines Varga" withLabel />
                </div>
              </Cell>
            </div>
          </div>
        </Section>

        <Section id="forms" title="Forms">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Default">{(p) => <Input {...p} placeholder="Your name" />}</Field>
            <Field label="Hover">{(p) => <Input {...p} placeholder="Your name" data-force="hover" />}</Field>
            <Field label="Focus">{(p) => <Input {...p} defaultValue="Ines Varga" data-force="focus" />}</Field>
            <Field label="Error" error="Enter a valid email address.">
              {(p) => <Input {...p} defaultValue="ines@" />}
            </Field>
            <Field label="Disabled" hint="Hints sit under the control.">
              {(p) => <Input {...p} disabled defaultValue="Locked" />}
            </Field>
            <Field label="With icon">
              {(p) => (
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
                  <Input {...p} type="search" placeholder="Search talent" className="pl-10" />
                </div>
              )}
            </Field>
            <Field label="Select" optional>
              {(p) => (
                <Select {...p} defaultValue="">
                  <option value="">Choose one</option>
                  <option>Feature film</option>
                  <option>Series</option>
                </Select>
              )}
            </Field>
            <Field label="Select, error" error="Choose a project type.">
              {(p) => (
                <Select {...p} defaultValue="">
                  <option value="">Choose one</option>
                </Select>
              )}
            </Field>
            <Field label="Textarea">{(p) => <Textarea {...p} rows={3} placeholder="The brief" />}</Field>
            <div className="grid gap-2">
              <Checkbox label="Unchecked" />
              <Checkbox label="Checked" defaultChecked />
              <Checkbox label="Focus" data-force="focus" />
              <Checkbox label="Error" error="Confirm you are 18 or over." />
              <Checkbox label="Disabled" disabled />
            </div>
            <div className="grid content-start gap-3">
              <FormMessage tone="error">Please check the highlighted fields.</FormMessage>
              <FormMessage tone="success">Thank you. Your reference is BK-7Q2M4X.</FormMessage>
            </div>
            <div className="grid content-start gap-6">
              <Cell label="segmented">
                <Segmented
                  label="View"
                  value={seg}
                  onChange={setSeg}
                  options={[
                    { value: 'grid', label: 'Grid view', icon: <LayoutGrid className="size-4" aria-hidden /> },
                    { value: 'list', label: 'List view', icon: <List className="size-4" aria-hidden /> },
                  ]}
                />
              </Cell>
              <Cell label="stepper">
                <Stepper steps={['About you', 'Your work', 'Confirm']} current={1} />
              </Cell>
              <Cell label="newsletter">
                <NewsletterForm />
              </Cell>
            </div>
          </div>
        </Section>

        <Section id="badges" title="Chips and badges">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-6">
              <Cell label="default">
                <Chip count={14}>Performers</Chip>
              </Cell>
              <Cell label="selected (click)">
                <Chip selected={chip} count={4} onClick={() => setChip((c) => !c)}>
                  Voices
                </Chip>
              </Cell>
              <Cell label="hover">
                <Chip data-force="hover">Directors</Chip>
              </Cell>
              <Cell label="focus">
                <Chip data-force="focus">Creators</Chip>
              </Cell>
              <Cell label="pressed">
                <Chip data-force="pressed">Creators</Chip>
              </Cell>
              <Cell label="disabled">
                <Chip disabled>Archive</Chip>
              </Cell>
            </div>
            <div className="flex flex-wrap gap-3">
              {(['neutral', 'violet', 'success', 'warning', 'danger'] as BadgeTone[]).map((t) => (
                <Badge key={t} tone={t} dot={t !== 'neutral'}>
                  {t}
                </Badge>
              ))}
              <AvailabilityBadge value="available" />
              <AvailabilityBadge value="limited" />
              <AvailabilityBadge value="booked" />
            </div>
          </div>
        </Section>

        <Section id="cards" title="Cards">
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            <Cell label="talent: default">
              <TalentCard talent={TALENT[0]} className="w-full" />
            </Cell>
            <Cell label="talent: hover">
              <TalentCard talent={TALENT[5]} force="hover" className="w-full" />
            </Cell>
            <Cell label="talent: focus">
              <TalentCard talent={TALENT[8]} force="focus" className="w-full" />
            </Cell>
            <Cell label="stat">
              <Stat value="140" label="Represented artists" className="w-full" />
            </Cell>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Cell label="post: default">
              <PostCard post={POSTS[0]} />
            </Cell>
            <Cell label="post: hover">
              <PostCard post={POSTS[2]} force="hover" />
            </Cell>
          </div>
          <div className="mt-10">
            <p className="micro mb-3 text-muted">work row: default, hover</p>
            <ul className="border-t border-line">
              <WorkRow project={WORK[0]} index={0} />
              <WorkRow project={WORK[2]} index={1} force="hover" />
            </ul>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Cell label="empty state">
              <EmptyState title="No one matches" body="Try a different name or skill." action={<Button variant="secondary">Clear filters</Button>} className="w-full" />
            </Cell>
            <Cell label="reel player">
              <ReelPlayer photoKey="styleguide" hue={268} title="Showreel 2026" seconds={42} className="w-full" />
            </Cell>
          </div>
        </Section>

        <Section id="media" title="Media">
          <p className="mb-6 text-sm text-muted">
            Generated art until real photography is mapped in <code className="font-mono text-fg">PHOTOS</code> (src/data.ts).
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((pose) => (
              <div key={pose} className="aspect-[4/5] overflow-hidden rounded-[var(--radius-md)]">
                <Photo photoKey={`sg-${pose}`} alt={`Portrait, pose ${pose + 1}`} hue={[268, 18, 200, 320][pose]} pose={pose} />
              </div>
            ))}
            {[268, 40, 150, 330].map((h) => (
              <div key={h} className="aspect-[16/10] overflow-hidden rounded-[var(--radius-md)]">
                <Photo photoKey={`sg-still-${h}`} alt="Still" hue={h} kind="still" />
              </div>
            ))}
          </div>
        </Section>

        <Section id="hud" title="Hero and HUD">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="panel relative overflow-hidden rounded-[var(--radius-lg)] p-6">
              <Dragonfly className="mx-auto w-full max-w-2xl" />
            </div>
            <div className="grid content-start gap-6">
              <Cell label="timecode">
                <Timecode start={93} className="text-fg" />
              </Cell>
              <Cell label="fps and rec">
                <div className="flex gap-6 text-fg">
                  <FpsCounter />
                  <RecIndicator />
                </div>
              </Cell>
              <Cell label="sparkle">
                <div className="flex gap-3">
                  <Sparkle />
                  <Sparkle className="size-5 text-violet-text" />
                </div>
              </Cell>
              <Cell label="ruler">
                <Ruler side="left" />
              </Cell>
              <Cell label="scroll cue">
                <ScrollCue target="colour" className="-rotate-6" />
              </Cell>
            </div>
          </div>
          <div className="mt-10">
            <Marquee items={['Performers', 'Voices', 'Directors', 'Creators']} />
          </div>
        </Section>

        <Section id="feedback" title="Feedback">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setModal(true)}>
              Open dialog
            </Button>
            <Button variant="secondary" onClick={() => toast('Ines Varga added to your shortlist')}>
              Show toast
            </Button>
          </div>
          <Modal open={modal} onClose={() => setModal(false)} title="Clear shortlist?" description="Dialogs trap focus, close on Escape and return focus to the opener.">
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModal(false)}>Confirm</Button>
            </div>
          </Modal>
        </Section>
      </div>
    </>
  )
}
