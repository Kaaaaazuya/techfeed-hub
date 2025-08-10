package com.techfeed.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @Column(length = 26)
    private String id;

    @Column(name = "blog_id", nullable = false, length = 26)
    private String blogId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(name = "url_hash", nullable = false, length = 64)
    private String urlHash;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(length = 255)
    private String author;

    @Column(name = "author_email_hash", length = 64)
    private String authorEmailHash;

    @Column(length = 10)
    private String language;

    @Column(name = "published_at", nullable = false)
    private LocalDateTime publishedAt;

    @Column(name = "updated_at_source")
    private LocalDateTime updatedAtSource;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "bookmark_count")
    private Integer bookmarkCount = 0;

    @Column(name = "share_count")
    private Integer shareCount = 0;

    @Column(name = "reading_time_minutes")
    private Integer readingTimeMinutes;

    @Column(name = "content_fetched_at")
    private LocalDateTime contentFetchedAt;

    @Column(name = "content_fetch_status", length = 20)
    private String contentFetchStatus = "PENDING";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Article() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Article(final String blogId, final String title, final String url, final String urlHash, final LocalDateTime publishedAt) {
        this();
        this.blogId = blogId;
        this.title = title;
        this.url = url;
        this.urlHash = urlHash;
        this.publishedAt = publishedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isPublishedToday() {
        if (publishedAt == null) {
            return false;
        }
        return publishedAt.toLocalDate().equals(LocalDate.now());
    }

    public boolean isPublishedOnDate(final LocalDate targetDate) {
        if (publishedAt == null) {
            return false;
        }
        return publishedAt.toLocalDate().equals(targetDate);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBlogId() {
        return blogId;
    }

    public void setBlogId(String blogId) {
        this.blogId = blogId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrlHash() {
        return urlHash;
    }

    public void setUrlHash(String urlHash) {
        this.urlHash = urlHash;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getAuthorEmailHash() {
        return authorEmailHash;
    }

    public void setAuthorEmailHash(String authorEmailHash) {
        this.authorEmailHash = authorEmailHash;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDateTime getUpdatedAtSource() {
        return updatedAtSource;
    }

    public void setUpdatedAtSource(LocalDateTime updatedAtSource) {
        this.updatedAtSource = updatedAtSource;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getClickCount() {
        return clickCount;
    }

    public void setClickCount(Integer clickCount) {
        this.clickCount = clickCount;
    }

    public Integer getBookmarkCount() {
        return bookmarkCount;
    }

    public void setBookmarkCount(Integer bookmarkCount) {
        this.bookmarkCount = bookmarkCount;
    }

    public Integer getShareCount() {
        return shareCount;
    }

    public void setShareCount(Integer shareCount) {
        this.shareCount = shareCount;
    }

    public Integer getReadingTimeMinutes() {
        return readingTimeMinutes;
    }

    public void setReadingTimeMinutes(Integer readingTimeMinutes) {
        this.readingTimeMinutes = readingTimeMinutes;
    }

    public LocalDateTime getContentFetchedAt() {
        return contentFetchedAt;
    }

    public void setContentFetchedAt(LocalDateTime contentFetchedAt) {
        this.contentFetchedAt = contentFetchedAt;
    }

    public String getContentFetchStatus() {
        return contentFetchStatus;
    }

    public void setContentFetchStatus(String contentFetchStatus) {
        this.contentFetchStatus = contentFetchStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Article article = (Article) o;
        return Objects.equals(urlHash, article.urlHash);
    }

    @Override
    public int hashCode() {
        return Objects.hash(urlHash);
    }

    @Override
    public String toString() {
        return "Article{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", publishedAt=" + publishedAt +
                ", blogId='" + blogId + '\'' +
                '}';
    }
}