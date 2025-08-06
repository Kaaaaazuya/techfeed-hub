# TechFeed Hub

## 📘 概要

**TechFeed Hub** は、エンジニアのための「AI要約付き・パーソナライズ可能なテックブログ収集サービス」です。  

---

## 🛠 使用技術スタック

| 領域      | 技術                                                  |
| ------- | --------------------------------------------------- |
| フロントエンド | Next.js, TypeScript                                 |
| バックエンド  | Java (Spring Boot)                                  |
| バッチ処理   | Java (AWS Lambda)                                   |
| インフラ    | AWS (RDS, S3, Lambda, EventBridge, App Runner), CDK |
| AI連携予定  | Amazon Bedrock, Polly                               |
| CI/CD   | GitHub Actions, Docker                              |

---

## 🧪 テスト

```bash
# フロントエンド
cd apps/frontend
npm run test

# バックエンド
cd apps/backend-api
./gradlew test
```

---

## 📦 デプロイ

* `frontend`: S3 + CloudFront
* `backend-api`: App Runner
* `rss-fetcher`: AWS Lambda（EventBridgeで定期実行）

CDK を使って一括デプロイ可能です。

```bash
cd infra/cdk
npx cdk deploy
```

---

## 📄 ライセンス

MIT License

---
