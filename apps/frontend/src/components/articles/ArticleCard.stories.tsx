import type { Meta, StoryObj } from '@storybook/react'
import ArticleCard from './ArticleCard'
import type { Article } from '@/types/api'

const meta: Meta<typeof ArticleCard> = {
  title: 'Components/Articles/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    article: {
      description: 'Article data to display',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockArticle: Article = {
  id: '01HZXM5K6JQF8X7QNRQ8BZYX3G',
  blogId: '01HZXM5K6JQF8X7QNRQ8BZYX3H',
  title: 'Introducing React 19: A Complete Guide to New Features',
  url: 'https://example.com/react-19-guide',
  content: 'A comprehensive overview of React 19 features...',
  excerpt: 'React 19 introduces several groundbreaking features that will revolutionize how we build modern web applications. Learn about the new hooks, improved performance, and developer experience enhancements.',
  author: 'John Smith',
  language: 'ja',
  publishedAt: new Date().toISOString(),
  viewCount: 1250,
  readingTimeMinutes: 8,
  createdAt: new Date().toISOString(),
  blogName: 'React Weekly',
}

export const Default: Story = {
  args: {
    article: mockArticle,
  },
}

export const WithoutExcerpt: Story = {
  args: {
    article: {
      ...mockArticle,
      excerpt: undefined,
    },
  },
}

export const WithoutAuthor: Story = {
  args: {
    article: {
      ...mockArticle,
      author: undefined,
    },
  },
}

export const WithoutReadingTime: Story = {
  args: {
    article: {
      ...mockArticle,
      readingTimeMinutes: undefined,
    },
  },
}

export const MinimalArticle: Story = {
  args: {
    article: {
      id: '01HZXM5K6JQF8X7QNRQ8BZYX3G',
      blogId: '01HZXM5K6JQF8X7QNRQ8BZYX3H',
      title: 'Simple Article Title',
      url: 'https://example.com/simple-article',
      content: 'Simple content',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
}

export const LongTitle: Story = {
  args: {
    article: {
      ...mockArticle,
      title: 'This is a Very Long Article Title That Should Wrap Properly and Demonstrate How the Component Handles Extended Text Content',
    },
  },
}

export const OldArticle: Story = {
  args: {
    article: {
      ...mockArticle,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
  },
}