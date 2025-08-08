-- TechFeed Hub - Database Constraints
-- Security and data integrity constraints

-- =====================================================
-- セキュリティ制約
-- =====================================================

-- パスワード強度チェック
ALTER TABLE users ADD CONSTRAINT users_password_strength_check
    CHECK (LENGTH(password_hash) >= 60); -- bcryptは60文字以上

-- セッション有効期限チェック
ALTER TABLE user_sessions ADD CONSTRAINT sessions_expires_check
    CHECK (expires_at > created_at);

-- 監査ログの改ざん防止
ALTER TABLE security_audit_logs ADD CONSTRAINT audit_immutable_check
    CHECK (occurred_at <= NOW());

-- アカウントロック期間制限
ALTER TABLE users ADD CONSTRAINT users_lock_duration_check
    CHECK (locked_until IS NULL OR locked_until > NOW());

-- =====================================================
-- データ整合性制約
-- =====================================================

-- ブログURL形式チェック
ALTER TABLE blogs ADD CONSTRAINT blogs_url_format_check
    CHECK (site_url ~ '^https?://.*' AND rss_url ~ '^https?://.*');

-- 記事URL形式チェック
ALTER TABLE articles ADD CONSTRAINT articles_url_format_check
    CHECK (url ~ '^https?://.*');

-- 品質スコア範囲チェック
ALTER TABLE blogs ADD CONSTRAINT blogs_quality_score_check
    CHECK (quality_score >= 0 AND quality_score <= 5.0);

-- 感情スコア範囲チェック
ALTER TABLE articles ADD CONSTRAINT articles_sentiment_score_check
    CHECK (sentiment_score IS NULL OR (sentiment_score >= -1.0 AND sentiment_score <= 1.0));

-- 難易度レベル範囲チェック
ALTER TABLE articles ADD CONSTRAINT articles_difficulty_level_check
    CHECK (difficulty_level IS NULL OR (difficulty_level >= 1 AND difficulty_level <= 5));

-- 成功率範囲チェック
ALTER TABLE blogs ADD CONSTRAINT blogs_success_rate_check
    CHECK (success_rate_percentage >= 0 AND success_rate_percentage <= 100.00);

-- =====================================================
-- 外部キー制約の追加設定
-- =====================================================

-- カスケード削除設定
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_category_id_fkey;
ALTER TABLE blogs ADD CONSTRAINT blogs_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_blog_id_fkey;
ALTER TABLE articles ADD CONSTRAINT articles_blog_id_fkey 
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE;

-- Note: Foreign key to partitioned table articles is handled at application level
-- ALTER TABLE article_tags ADD CONSTRAINT article_tags_article_id_fkey 
--     FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;

ALTER TABLE article_tags DROP CONSTRAINT IF EXISTS article_tags_tag_id_fkey;
ALTER TABLE article_tags ADD CONSTRAINT article_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

ALTER TABLE user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_blog_follows DROP CONSTRAINT IF EXISTS user_blog_follows_user_id_fkey;
ALTER TABLE user_blog_follows ADD CONSTRAINT user_blog_follows_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_blog_follows DROP CONSTRAINT IF EXISTS user_blog_follows_blog_id_fkey;
ALTER TABLE user_blog_follows ADD CONSTRAINT user_blog_follows_blog_id_fkey 
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE;