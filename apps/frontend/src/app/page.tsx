'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import ArticleList from '@/components/articles/ArticleList'

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">最新の技術記事</h1>
          <ArticleList 
            page={currentPage} 
            size={10} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </Layout>
  )
}
