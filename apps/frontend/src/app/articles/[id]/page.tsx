// Generate static params for static export
export function generateStaticParams() {
  // Since we don't have article data at build time, we'll generate a few sample routes
  // This allows the static export to work. The actual routing will be handled client-side
  return [{ id: 'sample' }, { id: 'placeholder' }]
}

// Client component for dynamic behavior
import ArticleDetailClient from './ArticleDetailClient'

export default function ArticleDetailPage() {
  return <ArticleDetailClient />
}
