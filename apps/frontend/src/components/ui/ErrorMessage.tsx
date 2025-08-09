interface ErrorMessageProps {
  error: Error
  onRetry?: () => void
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
      <div className="flex">
        <svg className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-3 flex-1">
          <h3 className="text-red-800 font-semibold mb-2">API接続エラー</h3>
          <p className="text-red-600 mb-4">
            APIサーバーに接続できませんでした: {error.message}
          </p>
          <div className="text-sm text-red-500 space-y-1">
            <p>考えられる原因:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Spring Boot APIサーバー (http://localhost:8080) が起動していない</li>
              <li>データベースが起動していない</li>
              <li>ネットワーク接続の問題</li>
            </ul>
            <p className="mt-3">
              解決方法: <code className="bg-red-100 px-2 py-1 rounded">task up</code> でサーバーを起動してください
            </p>
          </div>
          
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                再試行
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}