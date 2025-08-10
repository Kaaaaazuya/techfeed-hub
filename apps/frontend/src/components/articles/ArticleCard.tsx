import { Article } from '@/types/api'
import { memo, useMemo } from 'react'

interface ArticleCardProps {
  article: Article
}

function ArticleCard({ article }: ArticleCardProps) {
  const relativeTime = useMemo(() => {
    const publishedDate = new Date(article.publishedAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - publishedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '今日'
    if (diffDays === 2) return '昨日'
    if (diffDays <= 7) return `${diffDays - 1}日前`
    return publishedDate.toLocaleDateString('ja-JP')
  }, [article.publishedAt])

  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 sm:p-6">
      <div className="space-y-3">
        {/* タイトル */}
        <h2 className="text-lg sm:text-xl font-semibold leading-tight">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors text-gray-900"
          >
            {article.title}
          </a>
        </h2>

        {/* 抜粋 */}
        {article.excerpt && (
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* メタデータ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 pt-2 gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* 著者 */}
            {article.author && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {article.author}
              </span>
            )}

            {/* 読了時間 */}
            {article.readingTimeMinutes && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {article.readingTimeMinutes}分
              </span>
            )}

            {/* ブログ名 (API 型定義に含まれていれば) */}
            {article.blogName && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {article.blogName}
              </span>
            )}
          </div>

          {/* 日時 */}
          <time dateTime={article.publishedAt} className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {relativeTime}
          </time>
        </div>
      </div>
    </article>
  )
}

export default memo(ArticleCard)
