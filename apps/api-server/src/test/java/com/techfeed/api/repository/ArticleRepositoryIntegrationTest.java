package com.techfeed.api.repository;

import com.techfeed.api.entity.Article;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ArticleRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ArticleRepository articleRepository;

    private Article testArticle;

    @BeforeEach
    void setUp() {
        testArticle = new Article(
                "01ARZ3NDEKTSV4RRFFQ69G5FAV", // blogId
                "Spring Boot Testing Guide",
                "https://example.com/spring-boot-testing",
                "spring-boot-testing-hash",
                LocalDateTime.now().minusDays(1)
        );
        testArticle.setId("01ARZ3NDEKTSV4RRFFQ69G5FAV");
        testArticle.setAuthor("John Doe");
        testArticle.setLanguage("en");
        
        entityManager.persist(testArticle);
        entityManager.flush();
    }

    @Test
    void testFindById() {
        Optional<Article> found = articleRepository.findById(testArticle.getId());
        
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Spring Boot Testing Guide");
        assertThat(found.get().getUrl()).isEqualTo("https://example.com/spring-boot-testing");
    }

    @Test
    void testFindAllByOrderByPublishedAtDesc() {
        // Create additional articles with different published dates
        Article newerArticle = new Article(
                "01ARZ3NDEKTSV4RRFFQ69G5FAV",
                "Newer Article",
                "https://example.com/newer",
                "newer-hash",
                LocalDateTime.now()
        );
        newerArticle.setId("01ARZ3NDEKTSV4RRFFQ69G5FAX");
        entityManager.persist(newerArticle);
        entityManager.flush();

        Page<Article> result = articleRepository.findAllByOrderByPublishedAtDesc(PageRequest.of(0, 10));
        
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Newer Article");
        assertThat(result.getContent().get(1).getTitle()).isEqualTo("Spring Boot Testing Guide");
    }

    @Test
    void testFindByBlogId() {
        Page<Article> result = articleRepository.findByBlogId("01ARZ3NDEKTSV4RRFFQ69G5FAV", PageRequest.of(0, 10));
        
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getBlogId()).isEqualTo("01ARZ3NDEKTSV4RRFFQ69G5FAV");
    }

    @Test
    void testFindByPublishedAtBetween() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(2);
        LocalDateTime endDate = LocalDateTime.now();
        
        Page<Article> result = articleRepository.findByPublishedAtBetween(startDate, endDate, PageRequest.of(0, 10));
        
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Spring Boot Testing Guide");
    }

    @Test
    void testCountByPublishedAtBetween() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(2);
        LocalDateTime endDate = LocalDateTime.now();
        
        Long count = articleRepository.countByPublishedAtBetween(startDate, endDate);
        
        assertThat(count).isEqualTo(1);
    }
}