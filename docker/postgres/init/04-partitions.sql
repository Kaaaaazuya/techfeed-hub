-- TechFeed Hub - Database Partitions
-- Create initial partitions for large tables

-- 現在月の記事パーティション作成
DO $$
DECLARE
    current_month_start date;
    current_month_end date;
    next_month_start date;
    next_month_end date;
    table_name text;
BEGIN
    -- 現在月
    current_month_start := date_trunc('month', CURRENT_DATE);
    current_month_end := current_month_start + interval '1 month';
    
    -- 来月
    next_month_start := current_month_end;
    next_month_end := next_month_start + interval '1 month';

    -- 現在月の記事パーティション
    table_name := 'articles_y' || to_char(current_month_start, 'YYYY') || 'm' || to_char(current_month_start, 'MM');
    EXECUTE format('CREATE TABLE %I PARTITION OF articles FOR VALUES FROM (%L) TO (%L)',
        table_name, current_month_start, current_month_end);

    -- 来月の記事パーティション  
    table_name := 'articles_y' || to_char(next_month_start, 'YYYY') || 'm' || to_char(next_month_start, 'MM');
    EXECUTE format('CREATE TABLE %I PARTITION OF articles FOR VALUES FROM (%L) TO (%L)',
        table_name, next_month_start, next_month_end);

    -- 現在月の監査ログパーティション
    table_name := 'security_audit_logs_y' || to_char(current_month_start, 'YYYY') || 'm' || to_char(current_month_start, 'MM');
    EXECUTE format('CREATE TABLE %I PARTITION OF security_audit_logs FOR VALUES FROM (%L) TO (%L)',
        table_name, current_month_start, current_month_end);

    -- 来月の監査ログパーティション
    table_name := 'security_audit_logs_y' || to_char(next_month_start, 'YYYY') || 'm' || to_char(next_month_start, 'MM');
    EXECUTE format('CREATE TABLE %I PARTITION OF security_audit_logs FOR VALUES FROM (%L) TO (%L)',
        table_name, next_month_start, next_month_end);

END $$;