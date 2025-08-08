# TechFeed Hub - TODO リスト

## MVP機能 (Phase 1)

### ✅ 完了済み

- [x] **F-01: RSS/Atomフィードの定期収集**
  - Java RSS fetcher実装済み
  - Rome RSS library使用
  - PostgreSQLへの記事保存機能

- [x] **データベース設計**
  - 完全なDBスキーマ実装
  - blogs, articles, users, tagsテーブル
  - パーティション設計、セキュリティ監査ログ
  - ULID主キー、暗号化機能

- [x] **開発環境構築**
  - Docker Compose (PostgreSQL + Redis)
  - Task runner設定
  - Gradle Java project

### 🔄 実装中

なし

### ⏳ 未実装 (MVP必須機能)

- [ ] **F-02: 記事一覧表示機能** (Spring Boot API)
  - 記事取得API実装
  - ページネーション対応
  - 時系列ソート機能

- [ ] **F-03: 全文検索機能**
  - PostgreSQL全文検索実装
  - 記事タイトル・本文検索
  - 検索結果ランキング

- [ ] **F-04: レスポンシブデザイン** (Next.js)
  - フロントエンド実装
  - PC/タブレット/スマホ対応
  - 記事一覧・詳細画面

### 🏗️ インフラ (AWS環境)

- [ ] **AWS Lambda RSS収集**
  - Java Lambda関数デプロイ
  - 定期実行処理実装

- [ ] **Amazon EventBridge**
  - スケジュール実行設定
  - Lambda定期起動

- [ ] **AWS App Runner**
  - Spring Boot APIデプロイ
  - コンテナ環境構築

- [ ] **AWS S3 + CloudFront**
  - フロントエンドホスティング
  - CDN設定

## Phase 2: パーソナライズ機能

- [ ] **F-11: 購読ブログ選択機能**
  - ユーザー認証システム
  - ブログフォロー機能
  - 設定画面実装

- [ ] **F-12: キーワードフィルタリング**
  - キーワード登録機能
  - 記事ハイライト表示
  - フィルタリング設定

- [ ] **F-13: ミュート機能**
  - 不要キーワード設定
  - 記事非表示機能
  - ミュート設定管理

## Phase 3: AI活用機能

- [ ] **F-21: AI自動要約** (Amazon Bedrock)
  - 記事本文要約処理
  - 要約品質管理
  - 一覧・詳細画面表示

- [ ] **F-22: AI自動タギング**
  - 技術タグ自動付与
  - タグ精度向上
  - タグ管理機能

- [ ] **F-23: 関連記事レコメンド**
  - 記事類似度計算
  - レコメンド機能
  - 関連記事表示

## Phase 4: 音声配信機能

- [ ] **F-31: 記事音声化** (Amazon Polly)
  - Text-to-Speech実装
  - 音声ファイル生成
  - 音声プレイヤー

## 開発マイルストーン

### M1: 環境構築 ✅ 完了
- AWSアカウントセットアップ
- GitHubリポジトリ作成
- プロジェクト雛形作成

### M2: バッチ処理実装 ✅ 完了
- Lambda RSS取得処理
- RDS保存機能
- EventBridge定期実行

### M3: MVP完成 🔄 進行中 (3-4週目)
- App Runner APIデプロイ
- S3+CloudFront フロントエンド
- 記事一覧表示・検索機能

### M4以降: 拡張機能開発 ⏳ 未着手
- Phase 2から順次実装
- GitHubのIssueでタスク管理

---

**最終更新**: 2025-08-08
**現在のフェーズ**: M2完了 → M3進行中
**次のタスク**: Spring Boot API実装