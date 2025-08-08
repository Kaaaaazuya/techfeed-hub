-- TechFeed Hub - Database Triggers
-- Security and audit triggers

-- =====================================================
-- セキュリティトリガー
-- =====================================================

-- パスワード変更時の監査ログ生成
CREATE OR REPLACE FUNCTION log_password_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.password_hash != NEW.password_hash THEN
        INSERT INTO security_audit_logs (
            event_type, event_category, severity, user_id,
            action_description, success, request_id
        ) VALUES (
            'PASSWORD_CHANGE', 'AUTH', 'WARN', NEW.id,
            'User password changed', true, generate_ulid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_password_change_audit
    AFTER UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION log_password_change();

-- ログイン失敗回数の自動リセット
CREATE OR REPLACE FUNCTION reset_failed_attempts_on_success()
RETURNS TRIGGER AS $$
BEGIN
    -- セッション作成時に失敗回数をリセット
    UPDATE users SET
        failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = NEW.user_id AND failed_login_attempts > 0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_reset_failed_attempts
    AFTER INSERT ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION reset_failed_attempts_on_success();

-- =====================================================
-- データ更新トリガー
-- =====================================================

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- blogsテーブルのupdated_at更新
CREATE TRIGGER trigger_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- articlesテーブルのupdated_at更新
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- usersテーブルのupdated_at更新
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- tagsテーブルのupdated_at更新
CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 統計更新トリガー
-- =====================================================

-- タグの記事数カウント更新
CREATE OR REPLACE FUNCTION update_tag_article_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET article_count = article_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET article_count = article_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tag_article_count
    AFTER INSERT OR DELETE ON article_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_article_count();

-- ブログの記事数カウント更新
CREATE OR REPLACE FUNCTION update_blog_article_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET total_articles_count = total_articles_count + 1 WHERE id = NEW.blog_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET total_articles_count = total_articles_count - 1 WHERE id = OLD.blog_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_article_count
    AFTER INSERT OR DELETE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_blog_article_count();