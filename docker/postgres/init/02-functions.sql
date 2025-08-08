-- TechFeed Hub - Database Functions
-- ULID generation function and other utilities

-- ULID生成関数（PostgreSQL）
CREATE OR REPLACE FUNCTION generate_ulid() RETURNS CHAR(26) AS $$
DECLARE
    -- Crockford Base32エンコーディング文字セット
    encoding TEXT = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    unix_time BIGINT;
    output TEXT = '';
    temp_value BIGINT;
BEGIN
    -- 現在のUnixタイムスタンプ（ミリ秒）
    unix_time = FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000);

    -- タイムスタンプ部分（10文字）をbase32エンコード
    temp_value = unix_time;
    FOR i IN 0..9 LOOP
        output = SUBSTR(encoding, (temp_value & 31) + 1, 1) || output;
        temp_value = temp_value >> 5;
    END LOOP;

    -- ランダム部分（16文字）
    FOR i IN 0..15 LOOP
        output = output || SUBSTR(encoding, FLOOR(RANDOM() * 32)::INT + 1, 1);
    END LOOP;

    RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 自動パーティション作成関数
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void AS $$
DECLARE
    start_date date;
    end_date date;
    table_name text;
BEGIN
    -- 来月のパーティションを事前作成
    start_date := date_trunc('month', CURRENT_DATE + interval '1 month');
    end_date := start_date + interval '1 month';

    -- 監査ログパーティション
    table_name := 'security_audit_logs_y' || to_char(start_date, 'YYYY') || 'm' || to_char(start_date, 'MM');
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF security_audit_logs FOR VALUES FROM (%L) TO (%L)',
        table_name, start_date, end_date);

    -- 記事パーティション
    table_name := 'articles_y' || to_char(start_date, 'YYYY') || 'm' || to_char(start_date, 'MM');
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF articles FOR VALUES FROM (%L) TO (%L)',
        table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;