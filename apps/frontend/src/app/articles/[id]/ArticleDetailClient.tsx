'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function ArticleDetailClient() {
  const params = useParams()
  const articleId = params.id as string

  // 現在の実装では記事詳細APIがないため、外部リンクにリダイレクトする仕様
  // 将来的に記事詳細APIが実装されたら、ここでデータを取得して表示

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl text-gray-300">📄</div>
            <h1 className="text-2xl font-bold text-gray-900">記事詳細</h1>
            <p className="text-gray-600">
              記事ID:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">{articleId}</code>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                現在、記事詳細ページは実装準備中です。
                <br />
                記事を読むには、記事一覧からリンクをクリックして外部サイトにアクセスしてください。
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                記事一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
