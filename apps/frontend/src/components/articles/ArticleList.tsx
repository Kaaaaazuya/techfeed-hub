'use client'

import useSWR from 'swr'
import { fetcher, getArticlesUrl } from '@/lib/api'
import { ArticleListResponse } from '@/types/api'
import ArticleCard from './ArticleCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'

interface ArticleListProps {
  page?: number
  size?: number
  onPageChange?: (page: number) => void
}

export default function ArticleList({ page = 0, size = 10, onPageChange }: ArticleListProps) {
  const { data, error, isLoading } = useSWR<ArticleListResponse>(
    getArticlesUrl({ page, size }),
    fetcher
  )

  if (error) {
    return <ErrorMessage error={error} />
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
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={() => onPageChange?.(page - 1)}
          disabled={data.first}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          前のページ
        </button>
        
        <span className="text-sm text-gray-600">
          {data.page + 1} / {data.totalPages}
        </span>
        
        <button
          onClick={() => onPageChange?.(page + 1)}
          disabled={data.last}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          次のページ
        </button>
      </div>
    </div>
  )
}