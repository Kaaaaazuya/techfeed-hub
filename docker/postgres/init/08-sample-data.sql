-- TechFeed Hub - Sample Data
-- Initial data for development and testing

-- =====================================================
-- ブログカテゴリサンプルデータ
-- =====================================================
INSERT INTO blog_categories (name, description, icon_class, sort_order) VALUES
('企業技術ブログ', '企業の技術ブログ', 'fas fa-building', 1),
('個人ブログ', '個人の技術ブログ', 'fas fa-user', 2),
('公式ドキュメント', '技術公式サイト', 'fas fa-book', 3),
('コミュニティ', '技術コミュニティ', 'fas fa-users', 4);

-- =====================================================
-- タグカテゴリサンプルデータ
-- =====================================================
INSERT INTO tag_categories (name, description, color, sort_order) VALUES
('プログラミング言語', 'プログラミング言語関連', '#3B82F6', 1),
('フレームワーク', 'フレームワーク関連', '#10B981', 2),
('データベース', 'データベース関連', '#F59E0B', 3),
('クラウド', 'クラウドサービス関連', '#EF4444', 4),
('ツール', '開発ツール関連', '#8B5CF6', 5),
('概念・手法', '開発概念・手法', '#6B7280', 6);

-- =====================================================
-- タグサンプルデータ
-- =====================================================
INSERT INTO tags (name, normalized_name, category_id, description, is_verified) 
SELECT 
    t.name, 
    LOWER(REPLACE(t.name, ' ', '-')), 
    tc.id, 
    t.description,
    true
FROM tag_categories tc
CROSS JOIN (VALUES
    -- プログラミング言語
    ('JavaScript', 'JavaScriptプログラミング言語'),
    ('TypeScript', 'TypeScriptプログラミング言語'),
    ('Python', 'Pythonプログラミング言語'),
    ('Java', 'Javaプログラミング言語'),
    ('Go', 'Goプログラミング言語'),
    ('Rust', 'Rustプログラミング言語'),
    
    -- フレームワーク
    ('React', 'React.jsフロントエンドフレームワーク'),
    ('Next.js', 'Next.jsフルスタックフレームワーク'),
    ('Vue.js', 'Vue.jsフロントエンドフレームワーク'),
    ('Spring Boot', 'Spring Bootフレームワーク'),
    ('Express.js', 'Express.jsウェブフレームワーク'),
    
    -- データベース
    ('PostgreSQL', 'PostgreSQLデータベース'),
    ('MySQL', 'MySQLデータベース'),
    ('Redis', 'Redisインメモリデータベース'),
    ('MongoDB', 'MongoDBドキュメントデータベース'),
    
    -- クラウド
    ('AWS', 'Amazon Web Services'),
    ('Azure', 'Microsoft Azure'),
    ('GCP', 'Google Cloud Platform'),
    ('Docker', 'Dockerコンテナ技術'),
    ('Kubernetes', 'Kubernetesオーケストレーション'),
    
    -- ツール
    ('Git', 'Gitバージョン管理'),
    ('GitHub', 'GitHubプラットフォーム'),
    ('VS Code', 'Visual Studio Code'),
    ('Webpack', 'Webpackバンドラー'),
    
    -- 概念・手法
    ('アーキテクチャ', 'ソフトウェアアーキテクチャ'),
    ('セキュリティ', 'セキュリティ技術'),
    ('パフォーマンス', 'パフォーマンス最適化'),
    ('テスト', 'ソフトウェアテスト')
) AS t(name, description)
WHERE 
    (tc.name = 'プログラミング言語' AND t.name IN ('JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'))
    OR (tc.name = 'フレームワーク' AND t.name IN ('React', 'Next.js', 'Vue.js', 'Spring Boot', 'Express.js'))
    OR (tc.name = 'データベース' AND t.name IN ('PostgreSQL', 'MySQL', 'Redis', 'MongoDB'))
    OR (tc.name = 'クラウド' AND t.name IN ('AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'))
    OR (tc.name = 'ツール' AND t.name IN ('Git', 'GitHub', 'VS Code', 'Webpack'))
    OR (tc.name = '概念・手法' AND t.name IN ('アーキテクチャ', 'セキュリティ', 'パフォーマンス', 'テスト'));

-- =====================================================
-- ブログサンプルデータ
-- =====================================================
INSERT INTO blogs (name, site_url, rss_url, rss_url_hash, description, category_id) 
SELECT 
    b.name,
    b.site_url,
    b.rss_url,
    ENCODE(SHA256(b.rss_url::bytea), 'hex'),
    b.description,
    bc.id
FROM blog_categories bc
CROSS JOIN (VALUES
    ('技術ブログサンプル1', 'https://example1.com', 'https://example1.com/feed.xml', 'サンプル技術ブログ1'),
    ('技術ブログサンプル2', 'https://example2.com', 'https://example2.com/rss.xml', 'サンプル技術ブログ2'),
    ('個人ブログサンプル1', 'https://personal1.com', 'https://personal1.com/feed.xml', 'サンプル個人ブログ1'),
    ('個人ブログサンプル2', 'https://personal2.com', 'https://personal2.com/rss.xml', 'サンプル個人ブログ2')
) AS b(name, site_url, rss_url, description)
WHERE 
    (bc.name = '企業技術ブログ' AND b.name LIKE '技術ブログサンプル%')
    OR (bc.name = '個人ブログ' AND b.name LIKE '個人ブログサンプル%')
LIMIT 4;

-- =====================================================
-- 開発用管理ユーザー作成
-- =====================================================
INSERT INTO users (
    username, 
    email_encrypted, 
    email_hash, 
    password_hash, 
    display_name,
    is_admin,
    email_verified_at
) VALUES (
    'admin',
    pgp_sym_encrypt('admin@techfeed.local', 'dev-encryption-key'),
    ENCODE(SHA256('admin@techfeed.local'::bytea), 'hex'),
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBMQkmxOqHhzm6', -- password: admin123
    'System Administrator',
    true,
    NOW()
);

-- =====================================================
-- パーティション管理用定期実行設定
-- =====================================================
-- 注意: 本番環境では pg_cron などの外部ツールを使用
COMMENT ON FUNCTION create_monthly_partitions() IS 
'Monthly partition creation function. In production, schedule with pg_cron: SELECT cron.schedule(''create-partitions'', ''0 0 1 * *'', ''SELECT create_monthly_partitions();'');';