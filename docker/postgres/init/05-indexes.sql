-- TechFeed Hub - Database Indexes
-- Performance and security optimized indexes

-- =====================================================
-- ブログ関連インデックス（セキュリティ考慮）
-- =====================================================
CREATE INDEX idx_blogs_active_fetch ON blogs(is_active, last_fetched_at) WHERE is_active = true;
CREATE UNIQUE INDEX idx_blogs_rss_hash ON blogs(rss_url_hash);
CREATE INDEX idx_blog_fetch_logs_blog_time ON blog_fetch_logs(blog_id, started_at DESC);
CREATE INDEX idx_blog_fetch_logs_status ON blog_fetch_logs(status, started_at DESC);

-- =====================================================
-- 記事関連インデックス（性能最適化）
-- =====================================================
CREATE INDEX idx_articles_blog_published_covering ON articles(blog_id, published_at DESC, id);
CREATE INDEX idx_articles_published_desc ON articles(published_at DESC) WHERE published_at IS NOT NULL;
CREATE UNIQUE INDEX idx_articles_url_hash ON articles(url_hash);

-- フルテキスト検索（セキュアな検索）
CREATE INDEX idx_articles_title_search ON articles USING GIN(to_tsvector('simple', title));
CREATE INDEX idx_articles_content_search ON articles USING GIN(to_tsvector('japanese', COALESCE(content, summary, '')));

-- =====================================================
-- ユーザー関連インデックス（セキュリティ重要）
-- =====================================================
CREATE UNIQUE INDEX idx_users_email_hash ON users(email_hash);
CREATE UNIQUE INDEX idx_users_username_lower ON users(LOWER(username));
CREATE INDEX idx_users_failed_attempts ON users(failed_login_attempts) WHERE failed_login_attempts > 0;
CREATE INDEX idx_users_locked ON users(locked_until) WHERE locked_until IS NOT NULL;

-- =====================================================
-- セッション管理インデックス（セキュリティクリティカル）
-- =====================================================
CREATE UNIQUE INDEX idx_sessions_token_hash ON user_sessions(session_token_hash);
CREATE INDEX idx_sessions_user_active ON user_sessions(user_id, is_active, last_activity_at DESC);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE is_active = true;
CREATE INDEX idx_sessions_cleanup ON user_sessions(expires_at, is_active) WHERE is_active = false;

-- =====================================================
-- 監査ログ関連インデックス（セキュリティ分析用）
-- =====================================================
CREATE INDEX idx_audit_user_time ON security_audit_logs(user_id, occurred_at DESC);
CREATE INDEX idx_audit_event_severity ON security_audit_logs(event_type, severity, occurred_at DESC);
CREATE INDEX idx_audit_ip_time ON security_audit_logs(ip_address, occurred_at DESC);
CREATE INDEX idx_audit_failed_auth ON security_audit_logs(event_category, success, occurred_at DESC) 
    WHERE event_category = 'AUTH' AND success = false;

-- =====================================================
-- タグ関連インデックス
-- =====================================================
CREATE INDEX idx_tags_normalized_name ON tags(normalized_name);
CREATE INDEX idx_tags_trending_score ON tags(trending_score DESC);
CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- =====================================================
-- フォロー関連インデックス
-- =====================================================
CREATE INDEX idx_user_blog_follows_user ON user_blog_follows(user_id);
CREATE INDEX idx_user_blog_follows_blog ON user_blog_follows(blog_id);