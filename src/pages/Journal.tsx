import { useSearchParams } from 'react-router'

import { Chip } from '../components/Chip'
import { NewsletterForm } from '../components/NewsletterForm'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { FOOTER, POSTS, type Post } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const CATEGORIES: Post['category'][] = ['News', 'Signings', 'Behind the scenes', 'Advice']

export function Journal() {
  useDocumentTitle('Journal')
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const posts = POSTS.filter((p) => !category || p.category === category)
  const [lead, ...rest] = posts
  const set = (c: string) => setParams(c ? { category: c } : {}, { replace: true })
  return (
    <>
      <PageHeader word="JOURNAL" eyebrow="Journal" title="Journal" lead="Signings, premieres, behind-the-scenes and advice for artists." />
      <div className="flex flex-wrap gap-2 border-b border-line px-4 pb-6" role="group" aria-label="Category">
        <Chip selected={!category} count={POSTS.length} onClick={() => set('')}>
          Everything
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} selected={category === c} count={POSTS.filter((p) => p.category === c).length} onClick={() => set(category === c ? '' : c)}>
            {c}
          </Chip>
        ))}
      </div>
      <div className="grid gap-12 px-4 pt-10">
        {lead && <PostCard post={lead} large className="max-w-5xl" />}
        {rest.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
        <aside className="panel grid gap-6 rounded-[var(--radius-lg)] p-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="display text-[clamp(2rem,1.4rem+2vw,3.4rem)] text-bone">{FOOTER.newsletter.title}</h2>
            <p className="mt-3 text-muted">{FOOTER.newsletter.body}</p>
          </div>
          <NewsletterForm />
        </aside>
      </div>
    </>
  )
}
