// API型定義
export interface ArticleResponse {
  id: string
  blogId: string
  title: string
  url: string
  content: string
  summary?: string
  aiSummary?: string
  excerpt?: string
  author?: string
  language?: string
  publishedAt: string // ISO 8601 format
  viewCount?: number
  readingTimeMinutes?: number
  createdAt: string // ISO 8601 format
  blogName?: string // ブログ名
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

// リクエストパラメータ
export interface ArticleListParams {
  page?: number
  size?: number
  sort?: string
}

export interface SearchParams extends ArticleListParams {
  query: string
}

// APIエンドポイント型
export type ArticleListResponse = PageResponse<ArticleResponse>
export type SearchResponse = PageResponse<ArticleResponse>

// エイリアス
export type Article = ArticleResponse
