package rssfetcher;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import rssfetcher.config.EntityManagerFactoryProvider;
import rssfetcher.entity.Article;
import rssfetcher.repository.ArticleRepository;
import rssfetcher.service.RssFetcherService;

import java.time.LocalDate;
import java.util.List;

public class RssReader {

    public static void main(String[] args) {
        EntityManagerFactory entityManagerFactory = EntityManagerFactoryProvider.createEntityManagerFactory();
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        
        try {
            ArticleRepository articleRepository = new ArticleRepository(entityManager);
            RssFetcherService fetcherService = new RssFetcherService(articleRepository);

            String feedUrl = "https://yamadashy.github.io/tech-blog-rss-feed/feeds/rss.xml";
            
            System.out.println("=== RSS Reader with Database Storage ===");
            
            // 今日の記事を取得・保存
            List<Article> savedArticles = fetcherService.fetchAndSaveArticles(feedUrl, LocalDate.now());
            
            System.out.println("\n=== Today's Articles ===");
            List<Article> todaysArticles = fetcherService.getTodaysArticles();
            
            if (todaysArticles.isEmpty()) {
                System.out.println("No articles found for today.");
            } else {
                for (Article article : todaysArticles) {
                    System.out.println("----");
                    System.out.println("Title: " + article.getTitle());
                    System.out.println("Link: " + article.getLink());
                    System.out.println("Published Date: " + article.getPublishedDate());
                    System.out.println("Feed Source: " + article.getFeedSource());
                }
            }
            
            // 統計情報
            long totalCount = articleRepository.count();
            System.out.println("\n=== Statistics ===");
            System.out.println("Total articles in database: " + totalCount);
            System.out.println("Today's articles: " + todaysArticles.size());

        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            entityManager.close();
            entityManagerFactory.close();
        }
    }
}
