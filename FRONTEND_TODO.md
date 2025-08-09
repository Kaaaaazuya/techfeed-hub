# フロントエンド開発 TODO リスト

## 進捗概要
- **全タスク数**: 15個
- **完了**: 15個
- **進行中**: 0個
- **未着手**: 0個

## Phase 1: 基盤構築

### [x] 1. Next.jsプロジェクトの初期化
- `/apps/frontend/` ディレクトリ作成
- Next.js 14 (App Router) + TypeScript セットアップ
- package.json, tsconfig.json 基本設定

### [x] 2. 開発環境セットアップ
- TypeScript strict mode 設定
- ESLint + Prettier 設定
- VS Code設定 (.vscode/settings.json)

### [x] 3. UIライブラリの選択と設定
- Tailwind CSS + Headless UI 推奨
- UI コンポーネントライブラリ選定
- デザインシステム基盤構築

### [x] 4. API連携設定
- Spring Boot API との接続確認
- API型定義作成 (ArticleResponse, PageResponse等)
- HTTP クライアント設定 (SWR or TanStack Query)

## Phase 2: 基本UI実装

### [x] 5. 基本レイアウト実装
- Header, Navigation, Footer コンポーネント
- ページレイアウト構造
- ルーティング設定

### [x] 6. 記事一覧ページ実装
- ArticleList コンポーネント
- 記事データ取得・表示
- 時系列ソート機能

### [x] 7. 記事カードコンポーネント実装
- ArticleCard コンポーネント
- 記事メタデータ表示 (タイトル, 日時, ブログ名等)
- カード UI デザイン

### [x] 8. 記事詳細ページ実装
- ArticleDetail コンポーネント
- 記事本文表示
- 外部リンク処理

## Phase 3: 機能実装

### [x] 9. ページネーション機能実装
- ページネーションコンポーネント
- API との連携 (page, size パラメータ)
- 無限スクロール検討

### [x] 10. 検索機能実装
- SearchBox コンポーネント
- SearchResults コンポーネント
- 全文検索 API 連携

### [x] 11. レスポンシブデザイン実装
- PC (1024px+) レイアウト
- タブレット (768-1023px) レイアウト
- スマホ (～767px) レイアウト

### [x] 12. ローディング・エラー状態の実装
- ローディングスピナー・スケルトン
- エラーバウンダリ
- リトライ機能

## Phase 4: 最適化・デプロイ

### [x] 13. パフォーマンス最適化
- 画像遅延読み込み (next/image)
- 仮想スクロール (長い記事一覧用)
- コード分割・lazy loading

### [x] 14. SPA用の静的エクスポート設定
- next.config.js 設定 (output: 'export')
- 静的ファイル生成確認
- S3 + CloudFront デプロイ準備

### [x] 15. Task runner統合
- Taskfile.yml にフロントエンド開発コマンド追加
- 開発サーバー起動、ビルド、テストコマンド
- CI/CD パイプライン準備

## 技術スタック

### 採用予定技術
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Data Fetching**: SWR or TanStack Query
- **Testing**: Jest + React Testing Library
- **Deploy**: Static Export → S3 + CloudFront

### API連携
- **Backend**: Spring Boot API (`/apps/api-server/`)
- **Database**: PostgreSQL (既存)
- **Endpoints**: 
  - GET `/api/articles` - 記事一覧取得
  - GET `/api/articles/search` - 記事検索

---

## 🎯 完了状況

✅ **全15タスク完了（2025-08-09）**

### 主な成果
- Next.js 14 + TypeScript による SPA 構築完了
- API連携（Spring Boot）によるデータ表示機能実装
- レスポンシブデザイン対応
- 検索・ページネーション機能実装
- 静的エクスポート対応（S3デプロイ準備完了）
- Docker化完了（ポート3000で稼働中）

### 稼働中のサービス
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080
- **データベース**: PostgreSQL (435件の記事データ)

---

**最終更新**: 2025-08-09  
**開始日**: 2025-08-09  
**完了日**: 2025-08-09  
**現在の状況**: MVP フロントエンド完成 → AWS デプロイ準備