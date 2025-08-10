package rssfetcher.entity;

import org.junit.jupiter.api.Test;
import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ArticleTest {

    @Test
    void constructor_ShouldCreateArticleWithAllFields() {
        // Given
        String blogId = "test-blog-id";
        String title = "Test Title";
        String url = "https://example.com/test";
        String content = "Test content";
        String summary = "Test summary";
        String author = "Test Author";
        ZonedDateTime publishedAt = ZonedDateTime.now();

        // When
        Article article = new Article(blogId, title, url, content, summary, author, publishedAt);

        // Then
        assertNotNull(article);
        assertEquals(blogId, article.getBlogId());
        assertEquals(title, article.getTitle());
        assertEquals(url, article.getUrl());
        assertEquals(content, article.getContent());
        assertEquals(summary, article.getSummary());
        assertEquals(author, article.getAuthor());
        assertEquals(publishedAt, article.getPublishedAt());
    }

    @Test
    void setters_ShouldUpdateFields() {
        // Given
        Article article = new Article("blogId", "title", "url", "content", "summary", "author", ZonedDateTime.now());
        String newTitle = "Updated Title";

        // When
        article.setTitle(newTitle);

        // Then
        assertEquals(newTitle, article.getTitle());
    }

    @Test
    void getId_ShouldBeGeneratedAutomatically() {
        // Given
        Article article = new Article("blogId", "title", "url", "content", "summary", "author", ZonedDateTime.now());

        // When & Then
        assertNotNull(article.getId());
        assertTrue(article.getId().length() > 0);
    }
}