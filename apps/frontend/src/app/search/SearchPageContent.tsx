'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchBox from '@/components/ui/SearchBox'
import SearchResults from '@/components/ui/SearchResults'
import { SearchParams } from '@/types/api'

export default function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSearch, setCurrentSearch] = useState<SearchParams | null>(null)

  const queryFromUrl = searchParams.get('q') || ''
  const pageFromUrl = parseInt(searchParams.get('page') || '0', 10)

  useEffect(() => {
    if (queryFromUrl) {
      setCurrentSearch({
        query: queryFromUrl,
        page: pageFromUrl,
        size: 10
      })
    }
  }, [queryFromUrl, pageFromUrl])

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams()
    newSearchParams.set('q', query)
    newSearchParams.set('page', '0')
    router.push(`/search?${newSearchParams.toString()}`)
  }

  const handlePageChange = (page: number) => {
    if (!currentSearch) return
    
    const newSearchParams = new URLSearchParams()
    newSearchParams.set('q', currentSearch.query)
    newSearchParams.set('page', page.toString())
    router.push(`/search?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setCurrentSearch(null)
    router.push('/search')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">記事検索</h1>
          <SearchBox
            onSearch={handleSearch}
            defaultValue={queryFromUrl}
            placeholder="記事を検索..."
            className="w-full"
          />
        </div>

        {currentSearch ? (
          <SearchResults
            searchParams={currentSearch}
            onPageChange={handlePageChange}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl text-gray-300">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900">
                記事を検索してください
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                記事のタイトル、本文、要約から関連する記事を検索できます。
                上の検索ボックスにキーワードを入力してください。
              </p>
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
        )}
      </div>
    </div>
  )
}