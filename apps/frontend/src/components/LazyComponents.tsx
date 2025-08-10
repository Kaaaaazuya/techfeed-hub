import dynamic from 'next/dynamic'
import LoadingSpinner from './ui/LoadingSpinner'

// Lazy load heavy components for better initial page load
export const LazyVirtualizedArticleList = dynamic(
  () => import('./articles/VirtualizedArticleList'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
)

export const LazySearchResults = dynamic(() => import('./ui/SearchResults'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

export const LazyPagination = dynamic(() => import('./ui/Pagination'), {
  loading: () => <div className="h-12" />, // Simple placeholder for pagination
  ssr: true, // Keep SSR for SEO
})
