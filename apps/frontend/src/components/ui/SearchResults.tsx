'use client'

import useSWR from 'swr'
import { fetcher, getSearchUrl } from '@/lib/api'
import { SearchResponse, SearchParams } from '@/types/api'
import ArticleCard from '../articles/ArticleCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import Pagination from './Pagination'

interface SearchResultsProps {
  searchParams: SearchParams
  onPageChange: (page: number) => void
  onClearSearch: () => void
}

export default function SearchResults({
  searchParams,
  onPageChange,
  onClearSearch,
}: SearchResultsProps) {
  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    getSearchUrl(searchParams),
    fetcher
  )

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">検索結果</h2>
          <button
            onClick={onClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            検索をクリア
          </button>
        </div>
        <ErrorMessage error={error} onRetry={() => mutate()} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">検索中...</h2>
          <button
            onClick={onClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            検索をクリア
          </button>
        </div>
        <LoadingSpinner message={`「${searchParams.query}」を検索中...`} />
      </div>
    )
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">検索結果</h2>
          <button
            onClick={onClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            検索をクリア
          </button>
        </div>

        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            検索結果が見つかりませんでした
          </h3>
          <p className="text-gray-500 mb-4">
            「{searchParams.query}」に一致する記事が見つかりませんでした。
          </p>
          <div className="text-sm text-gray-400">
            <p>検索のヒント:</p>
            <ul className="mt-2 space-y-1 text-left max-w-md mx-auto">
              <li>• より一般的なキーワードを使用してみてください</li>
              <li>• スペルを確認してください</li>
              <li>• 別のキーワードで検索してみてください</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">検索結果</h2>
          <p className="text-sm text-gray-600">
            「{searchParams.query}」の検索結果: {data.totalElements}件
            {data.totalPages > 1 && (
              <span>
                {' '}
                (ページ {data.page + 1}/{data.totalPages})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onClearSearch}
          className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md border border-blue-200 hover:border-blue-300 transition-colors"
        >
          検索をクリア
        </button>
      </div>

      {/* 検索結果一覧 */}
      <div className="space-y-6">
        {data.content.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* ページネーション */}
      {data.totalPages > 1 && (
        <div className="pt-6">
          <Pagination
            currentPage={data.page + 1}
            totalPages={data.totalPages}
            onPageChange={pageNum => onPageChange(pageNum - 1)}
            className="justify-center"
          />
        </div>
      )}
    </div>
  )
}
