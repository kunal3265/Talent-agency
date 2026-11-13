import { ArrowRight, Camera, Disc3 } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router'

import { ButtonLink } from '../components/Button'
import { Dragonfly } from '../components/Dragonfly'
import { FpsCounter, RecIndicator, Ruler, Sparkle, Timecode } from '../components/Hud'
import { Marquee } from '../components/Marquee'
import { PostCard } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { ScrollCue } from '../components/ScrollCue'
import { SectionHeading } from '../components/SectionHeading'
import { Stat } from '../components/Stat'
import { TalentCard } from '../components/TalentCard'
import { Wordmark } from '../components/Wordmark'
import { WorkRow } from '../components/WorkRow'
import { DIVISIONS, HERO_RENDER, HOME, POSTS, SITE, TALENT, WORK } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useReducedMotion } from '../lib/useReducedMotion'

// Hero geometry follows the reference: the logotype starts 46px from the top
// and is 290/1440 of the width tall; everything else hangs off that.
const TOP = 46
const WM = 290 / 1440
const tv = (t: string) => ({ '--t': t }) as CSSProperties

function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const x = useTransform(sx, [-0.5, 0.5], [-14, 14])

  const onMove = (e: PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-hidden pt-14 md:block md:h-[max(640px,min(100svh,58vw))] md:pt-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_58%,rgb(42_29_92/0.55),transparent_70%)]" />
      <div className="grain absolute inset-0" />

      <h1 id="hero-title" className="sr-only">
        {SITE.name}: {SITE.role}
      </h1>

      {/* logotype */}
      <div className="relative md:absolute md:inset-x-0 md:top-(--t)" style={tv(`${TOP}px`)} aria-hidden>
        <Wordmark text="BRAVURA" label={SITE.name} />
      </div>

      {/* timecode and scribble, sitting on the letters */}
      <div
        className="pointer-events-none absolute left-1/2 z-30 hidden translate-x-[46px] text-white mix-blend-difference md:block"
        style={{ top: `calc(${TOP}px + ${WM * 33}vw)` }}
      >
        <Timecode start={HOME.timecodeStart} className="text-[12px]" />
      </div>
      <div
        className="pointer-events-none absolute z-10 hidden -rotate-6 md:block"
        style={{ top: `calc(${TOP}px + ${WM * 36}vw)`, left: '68.4%' }}
        aria-hidden
      >
        <span className="font-hand text-[clamp(22px,2.5vw,40px)] leading-none text-ultra">{HOME.scribble}</span>
        <svg viewBox="0 0 120 14" className="-mt-1 ml-2 w-[5vw] max-w-[84px] text-ultra">
          <path d="M2 9 C 30 3, 70 12, 118 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* label row under the logotype */}
      <ul
        className="relative z-20 mt-3 grid grid-cols-4 gap-2 px-4 md:absolute md:inset-x-0 md:top-(--t) md:mt-0 md:block md:h-10"
        style={tv(`calc(${TOP}px + ${WM * 100}vw + 2px)`)}
      >
        {HOME.hudLabels.map((l, i) => (
          <li
            key={l.to}
            className={
              ['md:absolute md:left-4', 'text-center md:absolute md:left-[23.3%] md:text-left', 'text-center md:absolute md:left-[72.6%] md:text-left', 'text-right md:absolute md:right-4'][i]
            }
          >
            <Link
              to={l.to}
              className="micro inline-flex min-h-10 min-w-10 items-center text-fg/90 transition-colors hover:text-violet-text focus-visible:text-violet-text"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* the dragonfly */}
      <motion.div
        className={
          HERO_RENDER
            ? 'relative z-10 mx-auto -mt-[6vw] w-[112vw] max-w-none self-center [perspective:1200px] md:absolute md:top-(--t) md:left-1/2 md:mt-0 md:w-[63vw] md:-translate-x-1/2'
            : 'relative z-10 mx-auto -mt-[8vw] w-[118vw] max-w-none self-center [perspective:1200px] md:absolute md:top-(--t) md:left-1/2 md:mt-0 md:w-[62vw] md:-translate-x-1/2'
        }
        style={tv(`calc(${TOP}px + ${WM * (HERO_RENDER ? 44 : 53.6)}vw)`)}
      >
        <motion.div style={reduced ? undefined : { rotateX, rotateY, x }} className="[transform-style:preserve-3d]">
          {HERO_RENDER ? (
            <div className="relative animate-hover">
              <div className="animate-pulse-glow absolute top-[22%] left-1/2 aspect-square w-[34%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(196_120_255/0.55),rgb(106_60_255/0.18)_45%,transparent_70%)] blur-2xl" />
              <img src={HERO_RENDER} alt="" width={1536} height={1024} fetchPriority="high" className="relative block w-full select-none" draggable={false} />
            </div>
          ) : (
            <Dragonfly className="w-full" />
          )}
        </motion.div>
      </motion.div>

      <Ruler side="left" className="absolute left-4 hidden md:flex" style={{ top: `calc(${TOP}px + ${WM * 108}vw)` }} />
      <Ruler side="right" className="absolute right-4 hidden md:flex" style={{ top: `calc(${TOP}px + ${WM * 108}vw)` }} />

      <div className="relative z-20 -mt-[34vw] flex justify-center md:absolute md:top-[69%] md:left-1/2 md:mt-0 md:-translate-x-[calc(50%+22px)]">
        <ScrollCue target="intro" className="-rotate-[7deg] scale-[0.8] md:scale-100" />
      </div>

      {/* bottom HUD */}
      <div className="relative z-20 mt-6 flex flex-col items-center gap-3 px-4 pb-5 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:pb-[22px]">
        <div className="flex items-center gap-1.5 text-fg/85" aria-hidden>
          <Camera className="size-4" strokeWidth={1.5} />
          <Disc3 className="size-[18px]" strokeWidth={1.5} />
        </div>
        <p className="micro max-w-[660px] text-center leading-[1.15] text-fg/90 text-balance">{SITE.tagline}</p>
        <div className="flex w-full items-center justify-between md:absolute md:inset-x-0 md:bottom-[22px] md:px-4">
          <FpsCounter className="text-fg/90" />
          <RecIndicator className="text-fg/90" />
        </div>
        <Sparkle className="absolute bottom-[38px] left-[31.3%] hidden size-2.5 md:block" />
        <Sparkle className="absolute right-[17.5%] bottom-[30px] hidden size-2.5 md:block" />
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle()
  const featured = TALENT.filter((t) => t.featured)
  return (
    <>
      <Hero />

      <section id="intro" className="scroll-mt-16 pt-20 md:pt-28" aria-labelledby="intro-title">
        <Marquee items={DIVISIONS.map((d) => d.plural).concat(['Feature films', 'Series', 'Micro-dramas', 'Unscripted'])} />
        <div className="grid gap-12 px-4 pt-20 md:pt-28 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="micro flex items-center gap-2 text-muted">
              <Sparkle className="size-2.5 text-violet-text" />
              {HOME.intro.eyebrow}
            </p>
            <h2 id="intro-title" className="display mt-4 text-[clamp(3rem,1.6rem+5.6vw,7.5rem)] text-bone text-balance">
              {HOME.intro.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end">
            <p className="text-[clamp(1.1rem,0.95rem+0.5vw,1.4rem)] leading-snug text-fg text-pretty">{HOME.intro.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/talent" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                Browse the roster
              </ButtonLink>
              <ButtonLink to="/about" variant="secondary">
                About the agency
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-4 pt-20 lg:grid-cols-4">
          {HOME.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <Stat value={s.value} label={s.label} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pt-28 md:pt-36" aria-labelledby="featured-title">
        <SectionHeading
          eyebrow="Featured talent"
          title={<span id="featured-title">On the roster now</span>}
          action={
            <ButtonLink to="/talent" variant="secondary" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              All {TALENT.length} artists
            </ButtonLink>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {featured.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.05}>
              <TalentCard talent={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pt-28 md:pt-36" aria-labelledby="work-title">
        <SectionHeading
          eyebrow="Selected work"
          title={<span id="work-title">Now showing</span>}
          action={
            <ButtonLink to="/work" variant="secondary" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              All work
            </ButtonLink>
          }
        />
        <ul className="mt-10 border-t border-line">
          {WORK.slice(0, 5).map((p, i) => (
            <WorkRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </section>

      <section className="px-4 pt-28 md:pt-36" aria-labelledby="services-title">
        <SectionHeading eyebrow="What we do" title={<span id="services-title">More than a list</span>} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-line sm:grid-cols-2 lg:grid-cols-4">
          {HOME.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="h-full">
              <div className="group h-full bg-void p-7 transition-colors hover:bg-ink">
                <p className="font-mono text-[11px] text-violet-text">0{i + 1}</p>
                <h3 className="mt-10 text-2xl font-semibold text-bone">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {HOME.quotes.map((q) => (
            <Reveal key={q.org}>
              <figure className="panel h-full rounded-[var(--radius-lg)] p-8">
                <blockquote className="text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-snug text-bone text-pretty">“{q.quote}”</blockquote>
                <figcaption className="micro mt-6 text-muted">
                  {q.name}, {q.org}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pt-28 md:pt-36" aria-labelledby="journal-title">
        <SectionHeading
          eyebrow="Journal"
          title={<span id="journal-title">From the set</span>}
          action={
            <ButtonLink to="/journal" variant="secondary" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Read the journal
            </ButtonLink>
          }
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {POSTS.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-4 mt-28 overflow-hidden rounded-[var(--radius-lg)] md:mt-36" aria-labelledby="cta-title">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgb(139_108_255/0.55),rgb(42_29_92/0.4)_40%,var(--color-ink)_75%)]" />
        <div className="grain absolute inset-0" />
        <div className="relative flex flex-col items-center px-6 py-20 text-center md:py-28">
          <h2 id="cta-title" className="display text-[clamp(2.75rem,1.4rem+5.4vw,7rem)] text-bone text-balance">
            {HOME.cta.title}
          </h2>
          <p className="mt-5 max-w-lg text-fg text-pretty">{HOME.cta.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/contact" size="lg" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              {HOME.cta.primary}
            </ButtonLink>
            <ButtonLink to="/join" size="lg" variant="secondary">
              {HOME.cta.secondary}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
