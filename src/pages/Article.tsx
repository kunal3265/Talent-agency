import { ArrowLeft, Link2 } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Photo } from '../components/Photo'
import { PostCard } from '../components/PostCard'
import { useToast } from '../components/Toast'
import { POSTS, postBySlug } from '../data'
import { formatDate } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFound } from './NotFound'

export function Article() {
  const { slug = '' } = useParams()
  const post = postBySlug(slug)
  useDocumentTitle(post?.title ?? 'Not found')
  const toast = useToast()
  if (!post) return <NotFound />
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied')
    } catch {
      toast('Copy the address from your browser bar to share')
    }
  }

  return (
    <article className="px-4 pt-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/journal" className="micro inline-flex min-h-10 items-center gap-1.5 text-fg hover:text-violet-text">
          <ArrowLeft className="size-3.5" aria-hidden /> Journal
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge tone="violet">{post.category}</Badge>
          <span className="micro text-muted">
            {formatDate(post.date)} · {post.minutes} min read
          </span>
        </div>
        <h1 className="display mt-5 text-[clamp(2.6rem,1.6rem+4vw,5.5rem)] text-bone text-balance">{post.title}</h1>
        <p className="mt-6 text-xl leading-snug text-fg text-pretty">{post.excerpt}</p>
      </div>
      <div className="mx-auto mt-10 aspect-[21/9] max-w-6xl overflow-hidden rounded-[var(--radius-lg)]">
        <Photo photoKey={post.slug} alt="" hue={post.hue} kind="still" />
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[18px] leading-relaxed text-fg">
        {post.body.map((p) => (
          <p key={p} className="text-pretty">
            {p}
          </p>
        ))}
        <div className="flex items-center gap-3 border-t border-line pt-6">
          <Button variant="secondary" size="sm" icon={<Link2 className="size-4" aria-hidden />} onClick={copy}>
            Copy link
          </Button>
        </div>
      </div>
      <section className="pt-24" aria-labelledby="more-title">
        <h2 id="more-title" className="display text-[clamp(2rem,1.4rem+2.6vw,4rem)] text-bone">
          Keep reading
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </article>
  )
}
