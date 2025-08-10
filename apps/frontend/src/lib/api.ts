import {
  ArticleListParams,
  ArticleListResponse,
  SearchParams,
  SearchResponse,
} from '@/types/api'

// APIベースURL（開発環境用）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Fetcher関数（SWR用）
export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 記事一覧取得API
export function getArticlesUrl(params: ArticleListParams = {}) {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined)
    searchParams.append('page', params.page.toString())
  if (params.size !== undefined)
    searchParams.append('size', params.size.toString())
  if (params.sort) searchParams.append('sort', params.sort)

  const query = searchParams.toString()
  return `${API_BASE_URL}/api/v1/articles${query ? `?${query}` : ''}`
}

// 記事検索API
export function getSearchUrl(params: SearchParams) {
  const searchParams = new URLSearchParams()

  searchParams.append('keyword', params.query)
  if (params.page !== undefined)
    searchParams.append('page', params.page.toString())
  if (params.size !== undefined)
    searchParams.append('size', params.size.toString())
  if (params.sort) searchParams.append('sort', params.sort)

  return `${API_BASE_URL}/api/v1/articles?${searchParams.toString()}`
}

// API関数
export async function fetchArticles(
  params: ArticleListParams = {}
): Promise<ArticleListResponse> {
  return fetcher<ArticleListResponse>(getArticlesUrl(params))
}

export async function searchArticles(
  params: SearchParams
): Promise<SearchResponse> {
  return fetcher<SearchResponse>(getSearchUrl(params))
}
