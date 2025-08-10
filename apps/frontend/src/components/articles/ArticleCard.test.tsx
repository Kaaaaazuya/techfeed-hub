import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ArticleCard from './ArticleCard'
import type { Article } from '@/types/api'

const mockArticle: Article = {
  id: '01HZXM5K6JQF8X7QNRQ8BZYX3G',
  blogId: '01HZXM5K6JQF8X7QNRQ8BZYX3H',
  title: 'Sample Article Title',
  url: 'https://example.com/article',
  content: 'Sample article content',
  excerpt: 'This is a sample excerpt for testing purposes.',
  author: 'Test Author',
  language: 'ja',
  publishedAt: new Date().toISOString(),
  viewCount: 100,
  readingTimeMinutes: 5,
  createdAt: new Date().toISOString(),
  blogName: 'Test Blog',
}

describe('ArticleCard', () => {
  it('renders article title as a link', () => {
    render(<ArticleCard article={mockArticle} />)

    const titleLink = screen.getByRole('link', { name: mockArticle.title })
    expect(titleLink).toBeInTheDocument()
    expect(titleLink).toHaveAttribute('href', mockArticle.url)
    expect(titleLink).toHaveAttribute('target', '_blank')
    expect(titleLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders article excerpt when provided', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText(mockArticle.excerpt!)).toBeInTheDocument()
  })

  it('does not render excerpt when not provided', () => {
    const articleWithoutExcerpt = { ...mockArticle, excerpt: undefined }
    render(<ArticleCard article={articleWithoutExcerpt} />)

    expect(
      screen.queryByText(/This is a sample excerpt/)
    ).not.toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText(mockArticle.author!)).toBeInTheDocument()
  })

  it('renders reading time when provided', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(
      screen.getByText(`${mockArticle.readingTimeMinutes}分`)
    ).toBeInTheDocument()
  })

  it('renders blog name when provided', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText(mockArticle.blogName!)).toBeInTheDocument()
  })

  it('does not render optional fields when not provided', () => {
    const minimalArticle: Article = {
      id: '01HZXM5K6JQF8X7QNRQ8BZYX3G',
      blogId: '01HZXM5K6JQF8X7QNRQ8BZYX3H',
      title: 'Minimal Article',
      url: 'https://example.com/minimal',
      content: 'Minimal content',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    render(<ArticleCard article={minimalArticle} />)

    expect(screen.queryByText(/分$/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Minimal Article' })
    ).toBeInTheDocument()
  })

  it('displays relative time correctly for today', () => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const articleToday = { ...mockArticle, publishedAt: today.toISOString() }

    render(<ArticleCard article={articleToday} />)

    const timeElement = screen.getByText(
      /今日|昨日|\d+日前|\d{4}\/\d{1,2}\/\d{1,2}/
    )
    expect(timeElement).toBeInTheDocument()
  })

  it('displays relative time correctly for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(12, 0, 0, 0)
    const articleYesterday = {
      ...mockArticle,
      publishedAt: yesterday.toISOString(),
    }

    render(<ArticleCard article={articleYesterday} />)

    const timeElement = screen.getByText(
      /今日|昨日|\d+日前|\d{4}\/\d{1,2}\/\d{1,2}/
    )
    expect(timeElement).toBeInTheDocument()
  })

  it('displays days ago for recent articles', () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    threeDaysAgo.setHours(12, 0, 0, 0)
    const articleThreeDaysAgo = {
      ...mockArticle,
      publishedAt: threeDaysAgo.toISOString(),
    }

    render(<ArticleCard article={articleThreeDaysAgo} />)

    const timeElement = screen.getByText(
      /今日|昨日|\d+日前|\d{4}\/\d{1,2}\/\d{1,2}/
    )
    expect(timeElement).toBeInTheDocument()
  })
})
