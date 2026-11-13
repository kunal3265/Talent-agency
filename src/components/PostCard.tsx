import { Link } from 'react-router'

import type { Post } from '../data'
import { cx } from '../lib/cx'
import { formatDate } from '../lib/format'
import { Badge } from './Badge'
import { Photo } from './Photo'

export function PostCard({ post, className, force, large }: { post: Post; className?: string; force?: string; large?: boolean }) {
  return (
    <Link
      to={`/journal/${post.slug}`}
      data-force={force}
      className={cx('group block rounded-[var(--radius-md)] focus-f:outline-2 focus-f:outline-offset-4 focus-f:outline-violet-text', className)}
    >
      <div className={cx('overflow-hidden rounded-[var(--radius-md)] bg-panel', large ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
        <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover-f:scale-[1.05]">
          <Photo photoKey={post.slug} alt="" hue={post.hue} kind="still" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Badge>{post.category}</Badge>
        <span className="micro text-muted">
          {formatDate(post.date)} · {post.minutes} min read
        </span>
      </div>
      <h3 className={cx('mt-3 font-semibold leading-tight text-bone transition-colors group-hover-f:text-violet-text text-balance', large ? 'text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)]' : 'text-xl')}>
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{post.excerpt}</p>
    </Link>
  )
}
