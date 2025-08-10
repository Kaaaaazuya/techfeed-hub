import type { Meta, StoryObj } from '@storybook/react'
import SearchBox from './SearchBox'

const meta: Meta<typeof SearchBox> = {
  title: 'Components/UI/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: {
      action: 'searched',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value for the search input',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether to auto-focus the input on mount',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onSearch: (query: string) => {
      console.log('Search query:', query)
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'TypeScriptの記事を検索...',
  },
}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'React',
  },
}

export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    placeholder: 'フォーカスされた検索ボックス',
  },
}

export const CustomStyling: Story = {
  args: {
    className: 'w-96',
    placeholder: '幅を広げたバージョン',
  },
}

export const LongPlaceholder: Story = {
  args: {
    placeholder: 'とても長いプレースホルダーテキストの例です。この場合の表示はどうなるでしょうか？',
  },
}