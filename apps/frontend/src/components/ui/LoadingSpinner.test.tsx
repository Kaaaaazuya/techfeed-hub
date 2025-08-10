import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)

    expect(screen.getByText('記事を読み込み中...')).toBeInTheDocument()

    const skeletonCards = screen.getAllByRole('generic')
    const cardContainers = skeletonCards.filter(
      element =>
        element.className.includes('bg-white') &&
        element.className.includes('animate-pulse')
    )
    expect(cardContainers).toHaveLength(5)
  })

  it('renders with custom count', () => {
    render(<LoadingSpinner count={3} />)

    const skeletonCards = screen.getAllByRole('generic')
    const cardContainers = skeletonCards.filter(
      element =>
        element.className.includes('bg-white') &&
        element.className.includes('animate-pulse')
    )
    expect(cardContainers).toHaveLength(3)
  })

  it('renders with custom message', () => {
    const customMessage = 'カスタムメッセージ'
    render(<LoadingSpinner message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
    expect(screen.queryByText('記事を読み込み中...')).not.toBeInTheDocument()
  })

  it('renders with both custom count and message', () => {
    const customMessage = 'テスト中...'
    render(<LoadingSpinner count={2} message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()

    const skeletonCards = screen.getAllByRole('generic')
    const cardContainers = skeletonCards.filter(
      element =>
        element.className.includes('bg-white') &&
        element.className.includes('animate-pulse')
    )
    expect(cardContainers).toHaveLength(2)
  })

  it('applies correct CSS classes', () => {
    render(<LoadingSpinner />)

    const messageElement = screen.getByText('記事を読み込み中...')
    expect(messageElement).toHaveClass(
      'text-sm',
      'text-gray-400',
      'animate-pulse'
    )
  })
})
