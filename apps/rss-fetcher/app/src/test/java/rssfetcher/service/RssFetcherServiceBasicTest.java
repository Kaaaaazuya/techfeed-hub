package rssfetcher.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import rssfetcher.entity.Article;
import rssfetcher.repository.ArticleRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RssFetcherServiceBasicTest {

    private RssFetcherService rssFetcherService;
    private MockArticleRepository mockRepository;

    @BeforeEach
    void setUp() {
        mockRepository = new MockArticleRepository();
        rssFetcherService = new RssFetcherService(mockRepository);
    }

    @Test
    void constructor_ShouldInitializeWithRepository() {
        // Given & When
        RssFetcherService service = new RssFetcherService(mockRepository);

        // Then
        assertNotNull(service);
    }

    @Test
    void getArticlesByDate_ShouldCallRepositoryMethod() {
        // Given
        LocalDate date = LocalDate.of(2024, 1, 1);

        // When
        List<Article> result = rssFetcherService.getArticlesByDate(date);

        // Then
        assertNotNull(result);
        assertEquals(date, mockRepository.lastQueriedDate);
    }

    @Test
    void getTodaysArticles_ShouldCallGetArticlesByDateWithToday() {
        // Given
        LocalDate expectedDate = LocalDate.now();

        // When
        List<Article> result = rssFetcherService.getTodaysArticles();

        // Then
        assertNotNull(result);
        assertEquals(expectedDate, mockRepository.lastQueriedDate);
    }

    // Mock implementation for testing
    private static class MockArticleRepository extends ArticleRepository {

        LocalDate lastQueriedDate;

        public MockArticleRepository() {
            super(null); // EntityManager not needed for this mock
        }

        @Override
        public List<Article> findByPublishedDate(LocalDate date) {
            this.lastQueriedDate = date;
            return Collections.emptyList();
        }

        @Override
        public void save(Article article) {
            // Mock implementation - do nothing
        }

        @Override
        public boolean existsByUrlHash(String urlHash) {
            return false;
        }
    }
}