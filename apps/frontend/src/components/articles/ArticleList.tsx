'use client'

import useSWR from 'swr'
import { fetcher, getArticlesUrl } from '@/lib/api'
import { ArticleListResponse } from '@/types/api'
import ArticleCard from './ArticleCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'
import Pagination from '../ui/Pagination'

interface ArticleListProps {
  page?: number
  size?: number
  onPageChange?: (page: number) => void
}

export default function ArticleList({ page = 0, size = 10, onPageChange }: ArticleListProps) {
  const { data, error, isLoading, mutate } = useSWR<ArticleListResponse>(
    getArticlesUrl({ page, size }),
    fetcher
  )

  if (error) {
    return <ErrorMessage error={error} onRetry={() => mutate()} />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600 mb-4">記事がありません</h2>
        <p className="text-gray-500">
          RSS取得バッチを実行して記事をデータベースに保存してください。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 記事統計情報 */}
      <div className="text-sm text-gray-600">
        {data.totalElements}件の記事 (ページ {data.page + 1}/{data.totalPages})
      </div>

      {/* 記事一覧 */}
      <div className="space-y-6">
        {data.content.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* ページネーション */}
      {onPageChange && (
        <div className="pt-6">
          <Pagination
            currentPage={data.page + 1}
            totalPages={data.totalPages}
            onPageChange={(pageNum) => onPageChange(pageNum - 1)}
            className="justify-center"
          />
        </div>
      )}
    </div>
  )
}