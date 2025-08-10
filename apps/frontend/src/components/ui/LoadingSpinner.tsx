interface LoadingSpinnerProps {
  count?: number
  message?: string
}

export default function LoadingSpinner({
  count = 5,
  message = '記事を読み込み中...',
}: LoadingSpinnerProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-sm text-gray-400 animate-pulse">{message}</div>

      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 animate-pulse"
        >
          <div className="space-y-3">
            {/* タイトル */}
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>

            {/* 抜粋 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* メタデータ */}
            <div className="flex justify-between pt-2">
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
