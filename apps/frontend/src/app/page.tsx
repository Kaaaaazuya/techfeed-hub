'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, getArticlesUrl } from '@/lib/api'
import { ArticleListResponse } from '@/types/api'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // Hydration mismatch を防ぐため
  useEffect(() => {
    setMounted(true)
  }, [])

  const { data, error, isLoading } = useSWR<ArticleListResponse>(
    mounted ? getArticlesUrl({ page: 0, size: 10 }) : null,
    fetcher
  )

  if (!mounted) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">TechFeed Hub</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">API接続エラー</h2>
            <p className="text-red-600">
              APIサーバーに接続できませんでした: {error.message}
            </p>
            <p className="text-sm text-red-500 mt-2">
              Spring Boot APIサーバー (http://localhost:8080)
              が起動しているか確認してください。
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">TechFeed Hub</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">TechFeed Hub</h1>

        {data && data.content.length > 0 ? (
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              {data.totalElements}件の記事 (ページ {data.page + 1}/
              {data.totalPages})
            </div>

            {data.content.map(article => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <h2 className="text-xl font-semibold mb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </a>
                </h2>

                {article.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="space-x-4">
                    {article.author && <span>著者: {article.author}</span>}
                    {article.readingTimeMinutes && (
                      <span>読了時間: {article.readingTimeMinutes}分</span>
                    )}
                  </div>
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                  </time>
                </div>
              </article>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button
                disabled={data.first}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                前のページ
              </button>
              <button
                disabled={data.last}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                次のページ
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4">記事がありません</h2>
            <p className="text-gray-500">
              RSS取得バッチを実行して記事をデータベースに保存してください。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
