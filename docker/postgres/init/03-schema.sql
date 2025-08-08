-- TechFeed Hub - Database Schema
-- Main table definitions

-- =====================================================
-- ブログ管理テーブル群
-- =====================================================

-- ブログカテゴリマスタ
CREATE TABLE blog_categories (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_class VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by CHAR(26)
);

-- ブログ情報
CREATE TABLE blogs (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    name VARCHAR(255) NOT NULL,
    site_url VARCHAR(500) NOT NULL,
    rss_url VARCHAR(500) NOT NULL UNIQUE,
    rss_url_hash CHAR(64) NOT NULL UNIQUE,
    description TEXT,
    favicon_url VARCHAR(500),
    category_id CHAR(26) REFERENCES blog_categories(id),
    language VARCHAR(10) DEFAULT 'ja',
    country VARCHAR(10) DEFAULT 'JP',
    quality_score DECIMAL(3,2) DEFAULT 0,
    content_frequency VARCHAR(20) DEFAULT 'UNKNOWN',
    is_active BOOLEAN DEFAULT true,
    fetch_interval_minutes INTEGER DEFAULT 60,
    fetch_timeout_seconds INTEGER DEFAULT 30,
    max_articles_per_fetch INTEGER DEFAULT 50,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    last_successful_fetch_at TIMESTAMP WITH TIME ZONE,
    last_error_message TEXT,
    consecutive_error_count INTEGER DEFAULT 0,
    total_articles_count INTEGER DEFAULT 0,
    avg_fetch_duration_ms INTEGER DEFAULT 0,
    success_rate_percentage DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by CHAR(26),
    updated_by CHAR(26)
);

-- ブログ取得履歴
CREATE TABLE blog_fetch_logs (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    blog_id CHAR(26) NOT NULL REFERENCES blogs(id),
    request_id CHAR(26) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    status VARCHAR(20) NOT NULL,
    articles_found INTEGER DEFAULT 0,
    articles_processed INTEGER DEFAULT 0,
    http_status_code INTEGER,
    response_size_bytes INTEGER,
    error_type VARCHAR(50),
    error_message TEXT,
    lambda_request_id VARCHAR(100),
    lambda_memory_used_mb INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- タグ管理テーブル群
-- =====================================================

-- タグカテゴリ
CREATE TABLE tag_categories (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by CHAR(26)
);

-- タグマスタ
CREATE TABLE tags (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    normalized_name VARCHAR(100) NOT NULL UNIQUE,
    category_id CHAR(26) REFERENCES tag_categories(id),
    description TEXT,
    official_url VARCHAR(500),
    article_count INTEGER DEFAULT 0,
    trending_score DECIMAL(8,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_deprecated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by CHAR(26),
    updated_by CHAR(26)
);

-- =====================================================
-- 記事管理テーブル群  
-- =====================================================

-- 記事メイン (パーティション対応)
CREATE TABLE articles (
    id CHAR(26) DEFAULT generate_ulid(),
    blog_id CHAR(26) NOT NULL REFERENCES blogs(id),
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    url_hash CHAR(64) NOT NULL,
    content TEXT,
    summary TEXT,
    ai_summary TEXT,
    excerpt TEXT,
    author VARCHAR(255),
    author_email_hash CHAR(64),
    language VARCHAR(10) DEFAULT 'ja',
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at_source TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    sentiment_score DECIMAL(3,2),
    difficulty_level SMALLINT,
    reading_time_minutes INTEGER,
    content_fetched_at TIMESTAMP WITH TIME ZONE,
    content_fetch_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, published_at),
    UNIQUE (url_hash, published_at)
) PARTITION BY RANGE (published_at);

-- 記事タグ関連 (M:N)
CREATE TABLE article_tags (
    article_id CHAR(26),
    tag_id CHAR(26) REFERENCES tags(id),
    confidence DECIMAL(3,2),
    detection_method VARCHAR(50),
    PRIMARY KEY (article_id, tag_id)
);

-- =====================================================
-- ユーザー管理テーブル群
-- =====================================================

-- ユーザー基本情報
CREATE TABLE users (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email_encrypted BYTEA NOT NULL,
    email_hash CHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    website_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    language VARCHAR(10) DEFAULT 'ja',
    theme VARCHAR(20) DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT true,
    trending_alerts BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_password_change TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    password_reset_token_hash CHAR(64),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    email_verification_token_hash CHAR(64),
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    articles_read_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by CHAR(26),
    updated_by CHAR(26)
);

-- セッション管理
CREATE TABLE user_sessions (
    id CHAR(26) PRIMARY KEY DEFAULT generate_ulid(),
    user_id CHAR(26) NOT NULL REFERENCES users(id),
    session_token_hash CHAR(64) NOT NULL UNIQUE,
    refresh_token_hash CHAR(64),
    ip_address INET NOT NULL,
    user_agent_hash CHAR(64) NOT NULL,
    device_fingerprint CHAR(64),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーブログフォロー
CREATE TABLE user_blog_follows (
    user_id CHAR(26) REFERENCES users(id),
    blog_id CHAR(26) REFERENCES blogs(id),
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, blog_id)
);

-- =====================================================
-- セキュリティ監査テーブル
-- =====================================================

-- セキュリティ監査ログ (パーティション対応)
CREATE TABLE security_audit_logs (
    id CHAR(26) DEFAULT generate_ulid(),
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(30) NOT NULL,
    severity VARCHAR(10) NOT NULL DEFAULT 'INFO',
    user_id CHAR(26) REFERENCES users(id),
    target_type VARCHAR(50),
    target_id CHAR(26),
    session_id CHAR(26),
    request_id CHAR(26) NOT NULL,
    ip_address INET NOT NULL,
    user_agent_hash CHAR(64) NOT NULL,
    action_description TEXT NOT NULL,
    old_values_hash CHAR(64),
    new_values_hash CHAR(64),
    success BOOLEAN NOT NULL,
    error_code VARCHAR(50),
    error_message TEXT,
    processing_time_ms INTEGER,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);