'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  autoFocus?: boolean
  className?: string
}

export default function SearchBox({
  onSearch,
  placeholder = '記事を検索...',
  defaultValue = '',
  autoFocus = false,
  className = ''
}: SearchBoxProps) {
  const [query, setQuery] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon 
            className="h-5 w-5 text-gray-400" 
            aria-hidden="true" 
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
          autoComplete="off"
          aria-label="検索クエリ"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-600"
            aria-label="検索をクリア"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
          aria-label="検索実行"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* 検索ヒント */}
      <div className="mt-2 text-xs text-gray-500">
        記事のタイトル・本文・要約から検索します。Escキーでクリア。
      </div>
    </form>
  )
}