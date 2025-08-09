# TechFeed Hub AWS デプロイガイド

## 🎯 AWS無料枠を活用したコンテナベース構成

このガイドでは、TechFeed HubをAWS無料枠を最大限活用してデプロイします。

## 📋 前提条件

### 必要なツール
- AWS CLI v2
- AWS CDK v2
- Docker
- Node.js 20+
- Java 21

### AWS アカウント設定
- AWS アカウント（無料枠対象）
- IAM権限（CDKデプロイ用）
- GitHub Actions用のOIDCプロバイダー設定

## 🏗️ インフラストラクチャ構成

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS無料枠構成                            │
├─────────────────────────────────────────────────────────────┤
│ Frontend: S3 + CloudFront (完全無料)                        │
│ API: ECS Fargate Spot (750時間/月無料)                      │  
│ Database: RDS PostgreSQL (db.t3.micro 12ヶ月無料)          │
│ Cache: ElastiCache Redis (cache.t3.micro 12ヶ月無料)       │
│ RSS Batch: Lambda Java21 (完全無料)                        │
│ Container Registry: ECR (1GB無料)                          │
│ Scheduling: EventBridge (無料)                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 デプロイ手順

### 1. 初回セットアップ

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd techfeed-hub

# 2. AWS認証情報設定
aws configure

# 3. CDK Bootstrap（初回のみ）
cd infra
npm install
npx cdk bootstrap

# 4. ECRリポジトリ作成
aws ecr create-repository --repository-name techfeed-api --region ap-northeast-1
```

### 2. 手動デプロイ（初回）

```bash
# 1. APIコンテナビルド＆プッシュ
cd apps/api-server
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com

docker build -t techfeed-api .
docker tag techfeed-api:latest <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/techfeed-api:latest
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/techfeed-api:latest

# 2. RSS Fetcher Lambda パッケージ作成
cd ../rss-fetcher
./gradlew build
mkdir -p lambda-package
cp app/build/libs/*.jar lambda-package/

# 3. フロントエンドビルド
cd ../frontend
npm install
npm run build:static

# 4. CDKでインフラデプロイ
cd ../../infra
npx cdk deploy --require-approval never

# 5. フロントエンドS3アップロード
cd ../apps/frontend
aws s3 sync out/ s3://techfeed-frontend-<account-id>-ap-northeast-1 --delete

# 6. CloudFrontキャッシュクリア
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

### 3. GitHub Actions CI/CD設定

#### 3.1 GitHub Repository Secrets設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

**Variables:**
- `ECR_REGISTRY`: `<account-id>.dkr.ecr.ap-northeast-1.amazonaws.com`
- `AWS_ROLE_ARN`: `arn:aws:iam::<account-id>:role/github-actions-role`
- `FRONTEND_BUCKET_NAME`: `techfeed-frontend-<account-id>-ap-northeast-1`
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFrontディストリビューションID

#### 3.2 AWS OIDC設定

```bash
# GitHub ActionsからAWSへのOIDC接続設定
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# IAMロール作成（trust-policy.json必要）
aws iam create-role --role-name github-actions-role --assume-role-policy-document file://trust-policy.json
aws iam attach-role-policy --role-name github-actions-role --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

`trust-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<github-username>/techfeed-hub:*"
        }
      }
    }
  ]
}
```

## 💰 コスト最適化設定

### 1. RDS設定
- インスタンスタイプ: `db.t3.micro` (無料枠)
- ストレージ: 20GB GP2 (無料枠)
- Multi-AZ: 無効
- 自動バックアップ: 7日間

### 2. ElastiCache設定
- ノードタイプ: `cache.t3.micro` (無料枠)
- レプリケーション: なし

### 3. ECS Fargate設定
- Fargate Spot利用 (最大90%削減)
- CPU: 256 (0.25 vCPU)
- Memory: 512 MB
- 750時間/月無料枠内で運用

### 4. Lambda設定
- メモリ: 1024MB
- タイムアウト: 15分
- 無料枠: 月100万リクエスト

## 📊 監視とメンテナンス

### CloudWatch設定
- ECS サービスメトリクス
- Lambda 実行ログ
- RDS パフォーマンスメトリクス
- 無料枠の範囲内で監視

### ログ管理
- CloudWatch Logs（5GB無料）
- 保持期間: 7日間（コスト削減）

## 🔧 トラブルシューティング

### 1. ECS Service起動失敗
```bash
# ECS タスク定義確認
aws ecs describe-services --cluster techfeed-cluster --services techfeed-api-service

# タスクログ確認
aws logs get-log-events --log-group-name /aws/ecs/techfeed-api
```

### 2. Lambda実行エラー
```bash
# Lambda関数ログ確認
aws logs get-log-events --log-group-name /aws/lambda/TechfeedStack-RssFetcherLambda
```

### 3. RDS接続エラー
- セキュリティグループ設定確認
- VPCエンドポイント設定確認

## 🎯 次のステップ

1. **運用監視強化**
   - CloudWatch アラーム設定
   - SNS通知設定

2. **セキュリティ強化**
   - WAF設定
   - SSL証明書設定

3. **パフォーマンス最適化**
   - CloudFront配信最適化
   - データベースインデックス調整

---

**注意**: AWS無料枠には制限があります。利用量を定期的に確認し、予期しない課金を避けてください。