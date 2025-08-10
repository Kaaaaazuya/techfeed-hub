'use client'

import { useCallback, useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher, getArticlesUrl, getSearchUrl } from '@/lib/api'
import { ArticleListResponse, Article } from '@/types/api'
import ArticleCard from './ArticleCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'

interface VirtualizedArticleListProps {
  initialPage?: number
  pageSize?: number
  searchQuery?: string
}

export default function VirtualizedArticleList({
  initialPage = 0,
  pageSize = 20,
  searchQuery,
}: VirtualizedArticleListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [hasMore, setHasMore] = useState(true)

  const apiUrl = searchQuery
    ? getSearchUrl({ query: searchQuery, page: currentPage, size: pageSize })
    : getArticlesUrl({ page: currentPage, size: pageSize })

  const { data, error, isLoading } = useSWR<ArticleListResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache
    }
  )

  useEffect(() => {
    if (data) {
      if (currentPage === 0) {
        setAllArticles(data.content)
      } else {
        setAllArticles(prev => [...prev, ...data.content])
      }
      setHasMore(!data.last)
    }
  }, [data, currentPage])

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isLoading])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return
      }
      loadMore()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  if (error) {
    return <ErrorMessage error={error} onRetry={() => setCurrentPage(0)} />
  }

  if (isLoading && allArticles.length === 0) {
    return <LoadingSpinner />
  }

  if (allArticles.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600 mb-4">記事がありません</h2>
        <p className="text-gray-500">
          {searchQuery
            ? 'お探しの記事が見つかりませんでした。別のキーワードで検索してください。'
            : 'RSS取得バッチを実行して記事をデータベースに保存してください。'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data && (
        <div className="text-sm text-gray-600">
          {data.totalElements}件の記事を表示中
        </div>
      )}

      <div className="space-y-6">
        {allArticles.map((article, index) => (
          <ArticleCard key={`${article.id}-${index}`} article={article} />
        ))}
      </div>

      {isLoading && allArticles.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!hasMore && allArticles.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          すべての記事を表示しました
        </div>
      )}
    </div>
  )
}
