'use client'

import { Suspense } from 'react'
import Layout from '@/components/layout/Layout'
import SearchPageContent from './SearchPageContent'

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={<SearchPageFallback />}>
        <SearchPageContent />
      </Suspense>
    </Layout>
  )
}

function SearchPageFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            記事検索
          </h1>
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8 animate-pulse">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
