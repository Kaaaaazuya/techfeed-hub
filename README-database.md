# TechFeed Hub - Database Setup

このドキュメントでは、TechFeed Hubのローカル開発環境でのデータベースセットアップ方法を説明します。

## 前提条件

- Docker & Docker Compose がインストールされている
- PostgreSQLクライアント（psql）がインストールされている（オプション）

## クイックスタート

### 1. 環境変数の設定

```bash
cp .env.example .env
# 必要に応じて .env ファイルを編集
```

### 2. データベースの起動

```bash
# PostgreSQL + Redis を起動
docker-compose up -d

# ログの確認
docker-compose logs -f postgres
```

### 3. データベース接続の確認

```bash
# psqlクライアントで接続
psql -h localhost -p 5432 -U techfeed_user -d techfeed_hub

# または Docker経由で接続
docker-compose exec postgres psql -U techfeed_user -d techfeed_hub
```

## データベース構成

### 技術スタック
- **データベース**: PostgreSQL 15
- **キャッシュ**: Redis 7
- **主キー**: ULID（セキュリティと性能の両立）
- **暗号化**: 保存時・転送時暗号化
- **パスワード**: bcrypt (cost=12)

### 主要テーブル

#### ブログ管理
- `blog_categories` - ブログカテゴリマスタ
- `blogs` - ブログ情報
- `blog_fetch_logs` - ブログ取得履歴

#### 記事管理
- `articles` - 記事メイン（パーティション対応）
- `article_tags` - 記事タグ関連（M:N）

#### タグ管理
- `tag_categories` - タグカテゴリ
- `tags` - タグマスタ

#### ユーザー管理
- `users` - ユーザー基本情報
- `user_sessions` - セッション管理
- `user_blog_follows` - ユーザーブログフォロー

#### セキュリティ
- `security_audit_logs` - セキュリティ監査ログ（パーティション対応）

### セキュリティ機能

1. **ULID主キー**: 推測不可能なID生成
2. **パスワードハッシュ**: bcrypt (cost=12)
3. **メール暗号化**: 個人情報保護
4. **セッション管理**: 安全なトークン管理
5. **監査ログ**: 全重要操作の記録
6. **制約・トリガー**: データ整合性とセキュリティ

## 開発用コマンド

### データベース管理

```bash
# データベースの停止
docker-compose down

# データベースのリセット（データ削除）
docker-compose down -v
docker-compose up -d

# バックアップ
docker-compose exec postgres pg_dump -U techfeed_user techfeed_hub > backup.sql

# リストア
cat backup.sql | docker-compose exec -T postgres psql -U techfeed_user -d techfeed_hub
```

### 接続情報

```
Host: localhost
Port: 5432
Database: techfeed_hub
Username: techfeed_user
Password: techfeed_password
```

### Redis接続情報

```
Host: localhost
Port: 6379
```

## パフォーマンス最適化

### インデックス戦略
- フルテキスト検索用GINインデックス
- セキュリティ重要テーブルの最適化
- パーティション対応テーブルの効率的検索

### パーティショニング
- `articles` テーブル: 月次パーティション
- `security_audit_logs` テーブル: 月次パーティション
- 自動パーティション作成機能

## トラブルシューティング

### よくある問題

1. **接続エラー**
   ```bash
   # コンテナの状態確認
   docker-compose ps
   
   # ログの確認
   docker-compose logs postgres
   ```

2. **権限エラー**
   ```bash
   # PostgreSQLコンテナ内でのユーザー確認
   docker-compose exec postgres psql -U postgres -c "\\du"
   ```

3. **パフォーマンス問題**
   ```bash
   # クエリ統計の確認
   docker-compose exec postgres psql -U techfeed_user -d techfeed_hub -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
   ```

### ログファイル
- PostgreSQL: コンテナ内の `/var/lib/postgresql/data/log/`
- アプリケーションログは各アプリケーションディレクトリの `logs/` フォルダ

## 本番環境への展開

本番環境では以下の設定変更が必要です：

1. 環境変数の適切な設定
2. SSL/TLS接続の有効化
3. バックアップ戦略の実装
4. 監視・アラートの設定
5. パーティション自動管理の設定

詳細は本番環境用のドキュメントを参照してください。