# TechFeed Hub - AWS デプロイ準備状況チェックリスト

**最終更新**: 2024-08-10  
**全体進捗**: 🟡 80% 完了 (セキュリティ・コスト最適化対応が必要)

## 📋 デプロイ準備状況サマリー

### 🟢 完了済み (準拠済み)
- [x] **インフラ基盤設定**
- [x] **アプリケーション構成**  
- [x] **CI/CD基本設定**
- [x] **基本的なコスト最適化**

### 🟡 要対応 (高優先度)
- [x] **ネットワークセキュリティ強化**
- [x] **VPCエンドポイント設定**
- [x] **Lambda最適化**

---

## 🏗️ インフラストラクチャ

### ✅ VPC・ネットワーク設計
- [x] カスタムVPC作成 (デフォルトVPC不使用)
- [x] 単一AZ構成でコスト最適化
- [x] NAT Gateway無効化 (月額$33削減)
- [x] セキュリティグループの最小権限設定
- [x] **🚨 プライベートサブネット追加** 
  - **現状**: パブリックサブネットのみ
  - **要対応**: RDS/Redis用プライベートサブネット作成
  - **ファイル**: `infra/lib/techfeed-stack.ts:25-32`
- [x] **🚨 RDS・Redisのプライベートサブネット移行**
  - **現状**: パブリックサブネットに配置 (セキュリティリスク)
  - **要対応**: プライベートサブネットへ移行
  - **ファイル**: `infra/lib/techfeed-stack.ts:65-67, 82-84`

### ✅ データベース
- [x] PostgreSQL 15.7 (最新安定版)
- [x] `db.t3.micro` インスタンス (無料利用枠)
- [x] 20GB GP2ストレージ (無料利用枠)
- [x] シングルAZ構成 (コスト削減)
- [x] バックアップ期間短縮 (1日)
- [x] Secrets Manager活用
- [x] Redis `cache.t3.micro` (無料利用枠)

### ✅ コンテナ・サーバーレス
- [x] ECR リポジトリ設定 (API + RSS Fetcher)
- [x] ECS Fargate設定
- [x] Fargate Spot利用 (コスト削減)
- [x] 最小リソース配分 (CPU: 256, Memory: 512MB)
- [x] Docker Lambda (RSS Fetcher)
- [x] **⚡ Lambda ARM (Graviton2) 対応**
  - **現状**: デフォルトx86アーキテクチャ
  - **要対応**: ARM64設定で20%コスト削減
  - **ファイル**: `infra/lib/techfeed-stack.ts:177`

### ❌ VPCエンドポイント (未実装)
- [x] **🚨 S3 Gateway VPCエンドポイント**
  - **理由**: NAT Gateway回避、データ転送コスト削減
  - **影響**: 静的アセット配信コスト削減
- [x] **🚨 ECR Interface VPCエンドポイント** 
  - **理由**: コンテナイメージ取得のコスト削減
  - **影響**: ECSデプロイメントコスト削減
- [x] **🚨 CloudWatch Logs Interface VPCエンドポイント**
  - **理由**: ログ配信のコスト削減
  - **影響**: 運用コスト削減

### ✅ CDN・静的コンテンツ
- [x] S3バケット (静的ホスティング設定)
- [x] CloudFront Distribution設定
- [x] SPA routing対応 (404→200リダイレクト)
- [x] HTTPS強制リダイレクト
- [x] キャッシュ最適化
- [x] **⚡ S3 Intelligent-Tiering設定**
  - **要対応**: 長期ストレージコスト削減
  - **影響**: 将来的なストレージコスト自動最適化

---

## 💻 アプリケーション

### ✅ API Server (Spring Boot + ECS)
- [x] マルチステージDockerビルド
- [x] 非rootユーザー実行 (セキュリティ)
- [x] ヘルスチェック設定
- [x] 環境変数・シークレット管理
- [x] Corretto 21 Alpine (軽量イメージ)

### ✅ RSS Fetcher (Java Lambda)
- [x] AWS Lambda用Dockerイメージ
- [x] 適切なハンドラー設定
- [x] マルチステージビルド
- [x] タイムアウト・メモリ設定
- [x] EventBridge スケジュール (6時間間隔)

### ✅ Frontend (Next.js + S3/CloudFront)
- [x] `output: "export"` 静的エクスポート
- [x] SSR機能無効化 (コスト最適化)
- [x] 画像最適化無効化 (静的エクスポート対応)
- [x] Bundle分析設定
- [x] Webpack最適化

---

## 🔄 CI/CD パイプライン

### ✅ GitHub Actions基本設定
- [x] OIDC認証 (長期認証情報不要)
- [x] プルリクエスト時テスト実行
- [x] メインブランチ自動デプロイ
- [x] 並列ビルド (Java + Node.js)
- [x] ECR プッシュ自動化
- [x] CloudFront キャッシュ無効化

### ❌ CI/CD最適化 (未実装)
- [x] **⚡ ジョブタイムアウト設定**
  - **要対応**: `timeout-minutes` で長時間実行防止
  - **ファイル**: `.github/workflows/deploy.yml`
- [x] **⚡ 進行中ジョブキャンセル設定**
  - **要対応**: `concurrency` と `cancel-in-progress` 設定
  - **影響**: GitHub Actions実行時間削減
- [x] **⚡ ジョブ並列化改善**
  - **現状**: 単一大きなジョブ
  - **要対応**: API/Frontend/Lambda個別ジョブ化

---

## 💰 コスト最適化

### ✅ 実装済み最適化
- [x] AWS無料利用枠最大活用
  - [x] RDS: `db.t3.micro` + 20GB GP2
  - [x] Lambda: 100万リクエスト/月
  - [x] CloudFront: 1TB転送/月
  - [x] S3: 5GB + 20,000 GET + 2,000 PUT/月
- [x] 単一AZ構成 (AZ間転送料金回避)
- [x] NAT Gateway回避 (月額$33削減)
- [x] Fargate Spot利用 (最大70%削減)
- [x] 最小リソース配分
- [x] バックアップ期間短縮

### ❌ 未実装最適化
- [x] **⚡ ARM (Graviton2) プロセッサ**
  - **対象**: Lambda関数
  - **削減**: 約20%のコンピューティングコスト
- [x] **⚡ VPCエンドポイント活用**
  - **削減**: データ転送コスト
  - **対象**: S3, ECR, CloudWatch通信
- [x] **⚡ S3ストレージ階層化**
  - **設定**: Intelligent-Tiering
  - **削減**: 長期ストレージコスト

---

## 🔒 セキュリティ

### ✅ 実装済みセキュリティ
- [x] GitHub Actions OIDC認証
- [x] Secrets Manager活用
- [x] セキュリティグループ最小権限
- [x] Docker非rootユーザー
- [x] HTTPS強制
- [x] パブリック読み取り制限

### ❌ 要対応セキュリティ
- [x] **🚨 データベースプライベート化**
  - **現状**: RDS・RedisがパブリックサブネットでInternet露出
  - **リスク**: 外部からの直接アクセス可能
  - **優先度**: 最高

---

## 📊 監視・運用

### ❌ 未実装 (任意対応)
- [x] **CloudWatchアラーム設定**
  - [x] コスト超過アラート
  - [x] パフォーマンスアラート
- [x] **ログ保持期間設定**
  - [x] CloudWatch Logs保持期間最適化
- [x] **リソースタグ付け**
  - [x] コスト配分用タグ設定

---

## 🚀 デプロイ実行チェックリスト

### 事前準備
- [x] AWS CLIインストール・設定
- [x] CDKインストール (`npm install -g aws-cdk`)
- [x] Docker環境確認
- [x] GitHub Repository変数設定
  - [x] `AWS_ROLE_ARN`
  - [x] `ECR_REGISTRY`
  - [x] `FRONTEND_BUCKET_NAME`
  - [x] `CLOUDFRONT_DISTRIBUTION_ID`

### デプロイ実行
- [x] CDK Bootstrap実行
  ```bash
  cd infra && npx cdk bootstrap
  ```
- [x] 初回CDKデプロイ
  ```bash
  cd infra && npx cdk deploy
  ```
- [x] ECRリポジトリ確認
- [x] 初回手動イメージプッシュ
- [x] GitHub Actions実行確認

---

## 🎯 次期対応優先度

### 🔥 高優先度 (セキュリティ・重大コスト影響)
1. **プライベートサブネット追加** → RDS/Redis移行
2. **VPCエンドポイント設定** (S3, ECR, CloudWatch)
3. **Lambda ARM化**

### ⚡ 中優先度 (コスト最適化)
4. **CI/CDワークフロー最適化**
5. **S3ストレージ最適化**

### 📋 低優先度 (運用改善)
6. **監視・アラート強化**
7. **ログ管理最適化**

---

## 📚 参考資料

- [個人開発WebアプリケーションのAWSデプロイガイド](./個人開発WebアプリケーションのAWSデプロイガイド-100825-072150.pdf)
- [CLAUDE.md](./CLAUDE.md) - プロジェクト開発ガイド
- [AWS無料利用枠](https://aws.amazon.com/free/)
- [CDKベストプラクティス](https://docs.aws.amazon.com/cdk/latest/guide/best-practices.html)

---

**💡 Note**: このチェックリストは進捗に応じて更新してください。各項目の完了時にチェックボックスをマークし、デプロイメントの進捗を可視化します。