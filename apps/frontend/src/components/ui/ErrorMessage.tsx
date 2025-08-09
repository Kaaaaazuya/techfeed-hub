interface ErrorMessageProps {
  error: Error
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex">
        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-3">
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
        </div>
      </div>
    </div>
  )
}