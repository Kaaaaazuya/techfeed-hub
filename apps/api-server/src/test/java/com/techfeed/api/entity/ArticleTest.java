package com.techfeed.api.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.LocalDateTime;
import static org.assertj.core.api.Assertions.assertThat;

class ArticleTest {

    @Test
    void testArticleConstructorSetsDefaults() {
        Article article = new Article();
        
        assertThat(article.getViewCount()).isEqualTo(0);
        assertThat(article.getClickCount()).isEqualTo(0);
        assertThat(article.getBookmarkCount()).isEqualTo(0);
        assertThat(article.getShareCount()).isEqualTo(0);
        assertThat(article.getContentFetchStatus()).isEqualTo("PENDING");
        assertThat(article.getCreatedAt()).isNotNull();
        assertThat(article.getUpdatedAt()).isNotNull();
    }

    @Test
    void testArticleParameterizedConstructor() {
        String blogId = "01ARZ3NDEKTSV4RRFFQ69G5FAV";
        String title = "Test Article";
        String url = "https://example.com/article";
        String urlHash = "test-hash";
        LocalDateTime publishedAt = LocalDateTime.now();

        Article article = new Article(blogId, title, url, urlHash, publishedAt);

        assertThat(article.getBlogId()).isEqualTo(blogId);
        assertThat(article.getTitle()).isEqualTo(title);
        assertThat(article.getUrl()).isEqualTo(url);
        assertThat(article.getUrlHash()).isEqualTo(urlHash);
        assertThat(article.getPublishedAt()).isEqualTo(publishedAt);
    }

    @Test
    void testIsPublishedToday() {
        Article articleToday = new Article();
        articleToday.setPublishedAt(LocalDateTime.now());
        assertThat(articleToday.isPublishedToday()).isTrue();

        Article articleYesterday = new Article();
        articleYesterday.setPublishedAt(LocalDateTime.now().minusDays(1));
        assertThat(articleYesterday.isPublishedToday()).isFalse();

        Article articleWithNullDate = new Article();
        articleWithNullDate.setPublishedAt(null);
        assertThat(articleWithNullDate.isPublishedToday()).isFalse();
    }

    @Test
    void testIsPublishedOnDate() {
        LocalDate targetDate = LocalDate.now().minusDays(3);
        
        Article articleOnTarget = new Article();
        articleOnTarget.setPublishedAt(targetDate.atStartOfDay());
        assertThat(articleOnTarget.isPublishedOnDate(targetDate)).isTrue();

        Article articleNotOnTarget = new Article();
        articleNotOnTarget.setPublishedAt(targetDate.minusDays(1).atStartOfDay());
        assertThat(articleNotOnTarget.isPublishedOnDate(targetDate)).isFalse();
    }

    @Test
    void testPreUpdate() {
        Article article = new Article();
        LocalDateTime originalUpdatedAt = article.getUpdatedAt();
        
        // Simulate some delay
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        article.preUpdate();
        assertThat(article.getUpdatedAt()).isAfter(originalUpdatedAt);
    }

    @Test
    void testEqualsAndHashCode() {
        String urlHash = "test-hash";
        
        Article article1 = new Article();
        article1.setUrlHash(urlHash);
        
        Article article2 = new Article();
        article2.setUrlHash(urlHash);
        
        Article article3 = new Article();
        article3.setUrlHash("different-hash");

        assertThat(article1).isEqualTo(article2);
        assertThat(article1).isNotEqualTo(article3);
        assertThat(article1.hashCode()).isEqualTo(article2.hashCode());
        assertThat(article1.hashCode()).isNotEqualTo(article3.hashCode());
    }

    @Test
    void testToString() {
        Article article = new Article();
        article.setId("01ARZ3NDEKTSV4RRFFQ69G5FAV");
        article.setTitle("Test Title");
        article.setUrl("https://example.com");
        article.setBlogId("blog-id");
        article.setPublishedAt(LocalDateTime.of(2024, 1, 1, 12, 0));

        String result = article.toString();
        
        assertThat(result).contains("01ARZ3NDEKTSV4RRFFQ69G5FAV");
        assertThat(result).contains("Test Title");
        assertThat(result).contains("https://example.com");
        assertThat(result).contains("blog-id");
    }
}