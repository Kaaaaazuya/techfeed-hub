'use client'

import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function SearchPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">記事検索</h1>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl text-gray-300">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900">検索機能</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  検索機能は Phase 3 で実装予定です。<br />
                  現在は記事一覧からブラウザの検索機能（Ctrl/Cmd + F）をご利用ください。
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  記事一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}