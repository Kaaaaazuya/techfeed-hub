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

- [x] **F-02: 記事一覧表示機能** (Spring Boot API)
  - 記事取得API実装済み (/api/v1/articles)
  - ページネーション対応済み
  - 時系列ソート機能
  - キーワード検索機能
  - 記事詳細取得API (/api/v1/articles/{id})

- [x] **F-04: レスポンシブデザイン** (Next.js)
  - フロントエンド実装済み
  - PC/タブレット/スマホ対応完了
  - 記事一覧・詳細画面実装済み
  - 検索機能実装済み

- [x] **開発環境構築**
  - Docker Compose (PostgreSQL + Redis)
  - Task runner設定
  - Gradle Java project

### 🔄 実装中

なし

### ✅ 追加完了済み機能

- [x] **F-03: 全文検索機能**
  - PostgreSQL全文検索実装済み ✅
  - 記事タイトル・本文検索機能実装済み ✅
  - 検索結果ランキング機能実装済み ✅

- [x] **品質管理ツール実装**
  - API Server: Checkstyle、PMD、SpotBugs、JaCoCo実装済み ✅
  - RSS Fetcher: 基本テスト環境構築済み ✅
  - Frontend: Vitest、Storybook、Jest実装済み ✅
  - CDK: Jest テスト環境構築済み ✅

### 🏗️ インフラ (AWS環境) - 未実装

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

### M3: MVP完成 ✅ 完了 (2025-08-09)
- Spring Boot API実装済み (8080ポートで稼働中) ✅
- Next.js フロントエンド実装済み (3000ポートで稼働中) ✅
- 記事一覧表示・検索機能実装済み ✅
- Docker化完了（全サービス稼働中）✅
- 全文検索機能実装済み ✅
- 品質管理ツール導入済み ✅

### M4: CI/CD環境整備 ⏳ 進行中 (2025-08-10)
- Phase 1基本テスト環境構築完了 ✅
- API Server品質チェック完了 ✅
- Frontend品質チェック完了 ✅
- CDK基本テスト完了 ✅

### M5以降: 拡張機能開発 ⏳ 未着手
- AWSインフラデプロイ
- Phase 2パーソナライズ機能実装
- Phase 3 AI活用機能実装

---

## 🔧 次に対応が必要な項目 (優先順位付き)

### 🚀 高優先度: CI/CD パイプライン構築
- [ ] **GitHub Actions ワークフローの実装**
  - プルリクエスト時の自動テスト実行
  - Branch Protection Rules設定
  - Quality Gates設定

### 🛠️ 中優先度: AWSデプロイメント準備
- [ ] **CDKインフラコード調整**
  - ECS deprecation warning修正
  - CDK Nag セキュリティチェック追加
- [ ] **本番環境設定**
  - 環境別設定ファイル整備
  - シークレット管理強化

### ⚡ 中優先度: 技術的改善
- [ ] **PostgreSQLの全文検索インデックス最適化**
- [ ] **APIのパフォーマンス改善** 
- [ ] **エラーハンドリング強化**

### 📊 低優先度: 運用・監視
- [ ] **ロギング・監視システム**
- [ ] **ヘルスチェック機能拡張**
- [ ] **バックアップ・リカバリー戦略**

### 🔒 低優先度: セキュリティ強化
- [ ] **APIセキュリティ強化（認証・認可）**
- [ ] **CORS設定の本番環境対応**
- [ ] **セキュリティヘッダー設定**

---

# CI/CD テスト・Linter 整備計画

## 1. RSS Fetcher (Java) - `/apps/rss-fetcher/`

### テストフレームワーク・ツール
- **Unit Test**: JUnit Jupiter 5 (既存設定済み)
- **Mocking**: Mockito
- **Integration Test**: Testcontainers (PostgreSQL)
- **Code Coverage**: JaCoCo
- **Static Analysis**: SpotBugs, PMD, Checkstyle

### 必要な作業
- [x] **JUnit 5テスト拡充** ✅ 基本完了
  - RssFetcherServiceのユニットテスト (基本実装済み)
  - ArticleRepositoryのデータベーステスト (基本実装済み)
  - RssBatchProcessorの統合テスト (基本実装済み)
- [ ] **Testcontainersによる統合テスト環境** (要強化)
  - PostgreSQLコンテナでのテスト環境構築
  - RSS fetching処理の結合テスト
- [x] **静的解析ツール導入** ✅ 完了
  - SpotBugs: バグパターン検出 ✅
  - PMD: コード品質チェック ✅
  - Checkstyle: コーディング規約チェック ✅
- [x] **JaCoCo カバレッジ測定** ✅ 完了
  - 最小カバレッジ10%設定済み (要80%に調整)
  - CI/CDでのカバレッジレポート生成準備完了
- [x] **Gradle build.gradle.kts更新** ✅ 完了
  - テスト・静的解析プラグイン追加済み ✅
  - quality gates設定済み ✅

### 推奨コマンド
```bash
./gradlew test          # ユニット・統合テスト実行
./gradlew check         # 静的解析 + テスト実行
./gradlew jacocoTestReport  # カバレッジレポート生成
```

## 2. API Server (Spring Boot) - `/apps/api-server/`

### テストフレームワーク・ツール
- **Unit Test**: JUnit Jupiter 5 + Spring Boot Test
- **Integration Test**: @SpringBootTest + Testcontainers
- **Web Layer Test**: @WebMvcTest
- **Repository Test**: @DataJpaTest
- **Code Coverage**: JaCoCo
- **Static Analysis**: SpotBugs, PMD, Checkstyle

### 必要な作業
- [x] **Spring Boot テスト強化** ✅ 基本完了
  - ArticleControllerのWebMvcテスト (基本実装済み)
  - ArticleServiceのユニットテスト (基本実装済み)
  - ArticleRepositoryの@DataJpaTest (基本実装済み)
- [x] **Testcontainers統合テスト** ✅ 実装済み
  - PostgreSQLコンテナでの完全統合テスト ✅
  - API エンドポイント全体テスト ✅
- [x] **静的解析導入** ✅ 完了 (RSS Fetcherと共通設定)
- [x] **JaCoCo カバレッジ測定** ✅ 完了
- [ ] **アーキテクチャテスト** (追加検討)
  - ArchUnit導入によるパッケージ依存関係チェック

### 推奨コマンド
```bash
./gradlew test          # 全テスト実行
./gradlew integrationTest  # 統合テストのみ
./gradlew check         # 静的解析 + テスト実行
```

## 3. Frontend (Next.js) - `/apps/frontend/`

### テストフレームワーク・ツール
- **Unit Test**: Jest + React Testing Library
- **E2E Test**: Playwright
- **Component Test**: Storybook + Chromatic
- **Linting**: ESLint (既存) + TypeScript ESLint
- **Formatting**: Prettier (既存)
- **Type Checking**: TypeScript compiler (tsc)

### 必要な作業
- [x] **Jest + RTL テスト環境構築** ✅ 基本完了
  - ArticleCard, ArticleList コンポーネントテスト (基本実装済み)
  - SearchPageContent, Pagination コンポーネントテスト (基本実装済み)
  - API レスポンスのモック化 (基本実装済み)
- [x] **Playwright E2Eテスト** ✅ 基本完了
  - 記事一覧表示テスト (基本実装済み)
  - 検索機能テスト (基本実装済み)
  - ページネーションテスト (基本実装済み)
- [x] **Storybook導入** ✅ 完了
  - コンポーネントのビジュアル回帰テスト ✅
  - デザインシステム構築基盤 ✅
- [x] **ESLint設定強化** ✅ 基本完了
  - Next.js推奨ルール ✅
  - アクセシビリティルール (eslint-plugin-jsx-a11y) ✅
  - React Hooks ルール ✅
- [ ] **TypeScript strict mode** (要強化)
  - tsconfig.json strict設定有効化
  - 型安全性向上

### 推奨コマンド
```bash
npm test            # Jest テスト実行
npm run test:e2e    # Playwright E2E テスト
npm run lint        # ESLint実行
npm run type-check  # TypeScript チェック
npm run storybook   # Storybook起動
```

## 4. CDK Infrastructure - `/infra/`

### テストフレームワーク・ツール
- **Unit Test**: Jest + AWS CDK Testing (既存設定済み)
- **Integration Test**: CDK Snapshot テスト
- **Infrastructure Test**: AWS CDK Assertions
- **Linting**: ESLint + TypeScript
- **Security Scan**: CDK Nag
- **Cost Estimation**: AWS Cost Calculator連携

### 必要な作業
- [x] **CDK Unit テスト拡充** ✅ 基本完了
  - Stack生成テスト (既存) ✅
  - リソース構成テスト (基本実装済み)
  - IAM Policy テスト (基本実装済み)
- [x] **CDK Integration テスト** ✅ 基本完了
  - CloudFormation template snapshot テスト ✅
  - リソース依存関係検証 ✅
- [ ] **CDK Nag セキュリティチェック** (要追加)
  - AWS Well-Architected Framework準拠チェック
  - セキュリティベストプラクティス検証
- [x] **ESLint + Prettier設定** ✅ 基本完了
  - TypeScript + Node.js ルール適用 ✅
  - Infrastructure as Code品質保証 ✅

### 推奨コマンド
```bash
npm test            # Jest CDKテスト実行
npm run lint        # ESLint実行
cdk synth           # CloudFormation template生成
cdk diff            # 変更差分確認
```

## 5. CI/CD パイプライン設計

### GitHub Actions ワークフロー構成

#### 5.1 プルリクエストワークフロー (.github/workflows/pr.yml)
```yaml
# 全コンポーネント並列テスト実行
- RSS Fetcher: ./gradlew check jacocoTestReport
- API Server: ./gradlew check jacocoTestReport  
- Frontend: npm run lint && npm run type-check && npm test
- CDK: npm run lint && npm test
```

#### 5.2 デプロイワークフロー (.github/workflows/deploy.yml)
```yaml
# メインブランチマージ時の自動デプロイ
- CDK デプロイ (インフラ)
- Lambda デプロイ (RSS Fetcher)
- App Runner デプロイ (API Server)
- S3 + CloudFront デプロイ (Frontend)
```

### 5.3 Quality Gates
- **必須条件** (PRマージ要件)
  - 全テスト成功
  - コードカバレッジ80%以上
  - 静的解析エラー0件
  - TypeScript型チェック成功
  - セキュリティスキャン成功

### 5.4 リポジトリ設定
- [ ] **Branch Protection Rules**
  - main ブランチ保護設定
  - PR review required
  - Status checks required
- [ ] **Secrets 管理**
  - AWS認証情報 (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  - Database接続情報 (本番環境)

## 6. 実装優先順位

### ✅ Phase 1: 基本テスト環境構築完了 (2025-08-10)
1. **RSS Fetcher**: JUnit拡充 + 静的解析導入 ✅
2. **API Server**: Spring Boot テスト + Testcontainers ✅
3. **Frontend**: Jest + RTL 基本テスト ✅

### 🚀 Phase 2: CI/CD パイプライン構築 (次の実装対象)
1. **GitHub Actions**: PR workflow
2. **Quality Gates**: カバレッジ・静的解析
3. **Branch Protection**: メインブランチ保護

### ⏳ Phase 3: 高度なテスト・セキュリティ (後続)
1. **Frontend**: TypeScript strict mode強化
2. **CDK**: CDK Nag セキュリティスキャン
3. **Integration**: 全システム統合テスト強化

### ⏳ Phase 4: 本番デプロイパイプライン (後続)
1. **Deploy Workflow**: 自動デプロイ
2. **Rollback Strategy**: 障害時復旧
3. **Monitoring**: デプロイ後監視

---

**最終更新**: 2025-08-10
**現在のフェーズ**: M4 CI/CD環境整備 → Phase 1完了、Phase 2 GitHub Actions着手準備
**次のタスク**: GitHub Actions ワークフロー実装とCI/CDパイプライン構築