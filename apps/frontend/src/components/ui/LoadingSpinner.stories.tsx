import type { Meta, StoryObj } from '@storybook/react'
import LoadingSpinner from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of skeleton cards to display',
    },
    message: {
      control: 'text',
      description: 'Loading message to display',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomCount: Story = {
  args: {
    count: 3,
  },
}

export const CustomMessage: Story = {
  args: {
    message: 'コンテンツを読み込み中...',
  },
}

export const SingleCard: Story = {
  args: {
    count: 1,
    message: '記事を準備中...',
  },
}

export const ManyCards: Story = {
  args: {
    count: 8,
    message: '大量のデータを読み込み中...',
  },
}