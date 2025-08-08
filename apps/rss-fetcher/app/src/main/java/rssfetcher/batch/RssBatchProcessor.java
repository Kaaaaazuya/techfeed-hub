package rssfetcher.batch;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import rssfetcher.config.EntityManagerFactoryProvider;
import rssfetcher.entity.Article;
import rssfetcher.repository.ArticleRepository;
import rssfetcher.service.RssFetcherService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

public class RssBatchProcessor {

    private static final String[] DEFAULT_FEED_URLS = {
        "https://yamadashy.github.io/tech-blog-rss-feed/feeds/rss.xml",
        // 他のRSSフィードURLをここに追加可能
    };

    private final EntityManagerFactory entityManagerFactory;

    public RssBatchProcessor() {
        this.entityManagerFactory = EntityManagerFactoryProvider.createEntityManagerFactory();
    }

    public void processFeeds(LocalDate targetDate) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            ArticleRepository articleRepository = new ArticleRepository(entityManager);
            RssFetcherService fetcherService = new RssFetcherService(articleRepository);

            System.out.println("Starting RSS batch processing for date: " + targetDate);
            
            int totalSaved = 0;
            for (String feedUrl : DEFAULT_FEED_URLS) {
                System.out.println("Processing feed: " + feedUrl);
                try {
                    List<Article> savedArticles = fetcherService.fetchAndSaveArticles(feedUrl, targetDate);
                    totalSaved += savedArticles.size();
                } catch (Exception e) {
                    System.err.println("Failed to process feed " + feedUrl + ": " + e.getMessage());
                }
            }
            
            System.out.println("Batch processing completed. Total articles saved: " + totalSaved);
            
        } finally {
            entityManager.close();
        }
    }

    public void processAllFeeds() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            ArticleRepository articleRepository = new ArticleRepository(entityManager);
            RssFetcherService fetcherService = new RssFetcherService(articleRepository);

            System.out.println("Starting RSS batch processing (all articles)");
            
            int totalSaved = 0;
            for (String feedUrl : DEFAULT_FEED_URLS) {
                System.out.println("Processing feed: " + feedUrl);
                try {
                    List<Article> savedArticles = fetcherService.fetchAndSaveArticles(feedUrl);
                    totalSaved += savedArticles.size();
                } catch (Exception e) {
                    System.err.println("Failed to process feed " + feedUrl + ": " + e.getMessage());
                }
            }
            
            System.out.println("Batch processing completed. Total articles saved: " + totalSaved);
            
        } finally {
            entityManager.close();
        }
    }

    public void close() {
        if (entityManagerFactory != null && entityManagerFactory.isOpen()) {
            entityManagerFactory.close();
        }
    }

    public static void main(String[] args) {
        RssBatchProcessor processor = new RssBatchProcessor();
        
        try {
            if (args.length == 0) {
                // 引数がない場合は本日の記事のみ処理
                processor.processFeeds(LocalDate.now());
            } else if (args.length == 1) {
                if ("all".equalsIgnoreCase(args[0])) {
                    // "all"が指定された場合は全記事処理
                    processor.processAllFeeds();
                } else {
                    // 日付が指定された場合はその日の記事のみ処理
                    try {
                        LocalDate targetDate = LocalDate.parse(args[0], DateTimeFormatter.ISO_LOCAL_DATE);
                        processor.processFeeds(targetDate);
                    } catch (DateTimeParseException e) {
                        System.err.println("Invalid date format. Use YYYY-MM-DD format or 'all'");
                        System.err.println("Usage: java RssBatchProcessor [YYYY-MM-DD|all]");
                        System.exit(1);
                    }
                }
            } else {
                System.err.println("Usage: java RssBatchProcessor [YYYY-MM-DD|all]");
                System.err.println("  No argument: Process today's articles");
                System.err.println("  YYYY-MM-DD: Process articles for specific date");
                System.err.println("  all: Process all articles");
                System.exit(1);
            }
        } finally {
            processor.close();
        }
    }
}