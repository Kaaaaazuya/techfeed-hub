# public.blogs

## Description

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| id | character(26) | generate_ulid() | false | [public.blog_fetch_logs](public.blog_fetch_logs.md) [public.user_blog_follows](public.user_blog_follows.md) [public.articles](public.articles.md) [public.articles_y2025m08](public.articles_y2025m08.md) |  |  |
| name | varchar(255) |  | false |  |  |  |
| site_url | varchar(500) |  | false |  |  |  |
| rss_url | varchar(500) |  | false |  |  |  |
| rss_url_hash | character(64) |  | false |  |  |  |
| description | text |  | true |  |  |  |
| favicon_url | varchar(500) |  | true |  |  |  |
| category_id | character(26) |  | true |  | [public.blog_categories](public.blog_categories.md) |  |
| language | varchar(10) | 'ja'::character varying | true |  |  |  |
| country | varchar(10) | 'JP'::character varying | true |  |  |  |
| quality_score | numeric(3,2) | 0 | true |  |  |  |
| content_frequency | varchar(20) | 'UNKNOWN'::character varying | true |  |  |  |
| is_active | boolean | true | true |  |  |  |
| fetch_interval_minutes | integer | 60 | true |  |  |  |
| fetch_timeout_seconds | integer | 30 | true |  |  |  |
| max_articles_per_fetch | integer | 50 | true |  |  |  |
| last_fetched_at | timestamp with time zone |  | true |  |  |  |
| last_successful_fetch_at | timestamp with time zone |  | true |  |  |  |
| last_error_message | text |  | true |  |  |  |
| consecutive_error_count | integer | 0 | true |  |  |  |
| total_articles_count | integer | 0 | true |  |  |  |
| avg_fetch_duration_ms | integer | 0 | true |  |  |  |
| success_rate_percentage | numeric(5,2) | 100.00 | true |  |  |  |
| created_at | timestamp with time zone | now() | true |  |  |  |
| updated_at | timestamp with time zone | now() | true |  |  |  |
| created_by | character(26) |  | true |  |  |  |
| updated_by | character(26) |  | true |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| blogs_quality_score_check | CHECK | CHECK (((quality_score >= (0)::numeric) AND (quality_score <= 5.0))) |
| blogs_success_rate_check | CHECK | CHECK (((success_rate_percentage >= (0)::numeric) AND (success_rate_percentage <= 100.00))) |
| blogs_url_format_check | CHECK | CHECK ((((site_url)::text ~ '^https?://.*'::text) AND ((rss_url)::text ~ '^https?://.*'::text))) |
| blogs_category_id_fkey | FOREIGN KEY | FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL |
| blogs_pkey | PRIMARY KEY | PRIMARY KEY (id) |
| blogs_rss_url_key | UNIQUE | UNIQUE (rss_url) |
| blogs_rss_url_hash_key | UNIQUE | UNIQUE (rss_url_hash) |

## Indexes

| Name | Definition |
| ---- | ---------- |
| blogs_pkey | CREATE UNIQUE INDEX blogs_pkey ON public.blogs USING btree (id) |
| blogs_rss_url_key | CREATE UNIQUE INDEX blogs_rss_url_key ON public.blogs USING btree (rss_url) |
| blogs_rss_url_hash_key | CREATE UNIQUE INDEX blogs_rss_url_hash_key ON public.blogs USING btree (rss_url_hash) |
| idx_blogs_active_fetch | CREATE INDEX idx_blogs_active_fetch ON public.blogs USING btree (is_active, last_fetched_at) WHERE (is_active = true) |
| idx_blogs_rss_hash | CREATE UNIQUE INDEX idx_blogs_rss_hash ON public.blogs USING btree (rss_url_hash) |

## Triggers

| Name | Definition |
| ---- | ---------- |
| trigger_blogs_updated_at | CREATE TRIGGER trigger_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column() |

## Relations

```mermaid
erDiagram

"public.blog_fetch_logs" }o--|| "public.blogs" : "FOREIGN KEY (blog_id) REFERENCES blogs(id)"
"public.user_blog_follows" }o--|| "public.blogs" : "FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE"
"public.articles" }o--|| "public.blogs" : "FOREIGN KEY (blog_id) REFERENCES blogs(id)"
"public.articles_y2025m08" }o--|| "public.blogs" : "FOREIGN KEY (blog_id) REFERENCES blogs(id)"
"public.blogs" }o--o| "public.blog_categories" : "FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL"

"public.blogs" {
  character_26_ id
  varchar_255_ name
  varchar_500_ site_url
  varchar_500_ rss_url
  character_64_ rss_url_hash
  text description
  varchar_500_ favicon_url
  character_26_ category_id FK
  varchar_10_ language
  varchar_10_ country
  numeric_3_2_ quality_score
  varchar_20_ content_frequency
  boolean is_active
  integer fetch_interval_minutes
  integer fetch_timeout_seconds
  integer max_articles_per_fetch
  timestamp_with_time_zone last_fetched_at
  timestamp_with_time_zone last_successful_fetch_at
  text last_error_message
  integer consecutive_error_count
  integer total_articles_count
  integer avg_fetch_duration_ms
  numeric_5_2_ success_rate_percentage
  timestamp_with_time_zone created_at
  timestamp_with_time_zone updated_at
  character_26_ created_by
  character_26_ updated_by
}
"public.blog_fetch_logs" {
  character_26_ id
  character_26_ blog_id FK
  character_26_ request_id
  timestamp_with_time_zone started_at
  timestamp_with_time_zone completed_at
  integer duration_ms
  varchar_20_ status
  integer articles_found
  integer articles_processed
  integer http_status_code
  integer response_size_bytes
  varchar_50_ error_type
  text error_message
  varchar_100_ lambda_request_id
  integer lambda_memory_used_mb
  timestamp_with_time_zone created_at
}
"public.user_blog_follows" {
  character_26_ user_id FK
  character_26_ blog_id FK
  timestamp_with_time_zone followed_at
}
"public.articles" {
  character_26_ id
  character_26_ blog_id FK
  varchar_500_ title
  varchar_1000_ url
  character_64_ url_hash
  text content
  text summary
  text ai_summary
  text excerpt
  varchar_255_ author
  character_64_ author_email_hash
  varchar_10_ language
  timestamp_with_time_zone published_at
  timestamp_with_time_zone updated_at_source
  integer view_count
  integer click_count
  integer bookmark_count
  integer share_count
  numeric_3_2_ sentiment_score
  smallint difficulty_level
  integer reading_time_minutes
  timestamp_with_time_zone content_fetched_at
  varchar_20_ content_fetch_status
  timestamp_with_time_zone created_at
  timestamp_with_time_zone updated_at
}
"public.articles_y2025m08" {
  character_26_ id
  character_26_ blog_id FK
  varchar_500_ title
  varchar_1000_ url
  character_64_ url_hash
  text content
  text summary
  text ai_summary
  text excerpt
  varchar_255_ author
  character_64_ author_email_hash
  varchar_10_ language
  timestamp_with_time_zone published_at
  timestamp_with_time_zone updated_at_source
  integer view_count
  integer click_count
  integer bookmark_count
  integer share_count
  numeric_3_2_ sentiment_score
  smallint difficulty_level
  integer reading_time_minutes
  timestamp_with_time_zone content_fetched_at
  varchar_20_ content_fetch_status
  timestamp_with_time_zone created_at
  timestamp_with_time_zone updated_at
}
"public.blog_categories" {
  character_26_ id
  varchar_50_ name
  text description
  varchar_50_ icon_class
  integer sort_order
  timestamp_with_time_zone created_at
  character_26_ created_by
}
```

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
