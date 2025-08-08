package rssfetcher.service;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import rssfetcher.entity.Article;
import rssfetcher.repository.ArticleRepository;

import java.net.URI;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RssFetcherService {
    
    private final ArticleRepository articleRepository;

    public RssFetcherService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> fetchAndSaveArticles(String feedUrl) {
        return fetchAndSaveArticles(feedUrl, null);
    }

    public List<Article> fetchAndSaveArticles(String feedUrl, LocalDate targetDate) {
        List<Article> savedArticles = new ArrayList<>();
        
        try {
            URL url = URI.create(feedUrl).toURL();
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(url));

            System.out.println("Fetching from feed: " + feed.getTitle());
            System.out.println("Feed URL: " + feedUrl);

            List<SyndEntry> entries = feed.getEntries();
            int processedCount = 0;
            int savedCount = 0;
            int skippedCount = 0;

            for (SyndEntry entry : entries) {
                processedCount++;
                
                if (entry.getLink() == null) {
                    System.out.println("Skipping entry with null link: " + entry.getTitle());
                    skippedCount++;
                    continue;
                }

                // 日付フィルタリング
                LocalDateTime publishedDate = convertToLocalDateTime(entry.getPublishedDate());
                if (targetDate != null && publishedDate != null) {
                    LocalDate publishedLocalDate = publishedDate.toLocalDate();
                    if (!publishedLocalDate.equals(targetDate)) {
                        skippedCount++;
                        continue;
                    }
                }

                // 重複チェック
                if (articleRepository.existsByLink(entry.getLink())) {
                    System.out.println("Article already exists, skipping: " + entry.getTitle());
                    skippedCount++;
                    continue;
                }

                // 記事作成と保存
                Article article = createArticleFromEntry(entry, feed, feedUrl);
                try {
                    articleRepository.save(article);
                    savedArticles.add(article);
                    savedCount++;
                    System.out.println("Saved: " + article.getTitle());
                } catch (Exception e) {
                    System.err.println("Failed to save article: " + article.getTitle() + " - " + e.getMessage());
                    skippedCount++;
                }
            }

            System.out.println(String.format(
                "Feed processing completed. Processed: %d, Saved: %d, Skipped: %d", 
                processedCount, savedCount, skippedCount));

        } catch (FeedException fe) {
            System.err.println("Failed to parse the feed: " + fe.getMessage());
            throw new RuntimeException("Feed parsing failed", fe);
        } catch (Exception e) {
            System.err.println("Unexpected error while fetching feed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("RSS fetching failed", e);
        }

        return savedArticles;
    }

    private Article createArticleFromEntry(SyndEntry entry, SyndFeed feed, String feedUrl) {
        String title = entry.getTitle() != null ? entry.getTitle() : "No Title";
        String link = entry.getLink();
        String description = entry.getDescription() != null ? entry.getDescription().getValue() : null;
        LocalDateTime publishedDate = convertToLocalDateTime(entry.getPublishedDate());
        String feedTitle = feed.getTitle();

        return new Article(title, link, description, publishedDate, feedUrl, feedTitle);
    }

    private LocalDateTime convertToLocalDateTime(Date date) {
        if (date == null) {
            return LocalDateTime.now();
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public List<Article> getArticlesByDate(LocalDate date) {
        return articleRepository.findByPublishedDate(date);
    }

    public List<Article> getTodaysArticles() {
        return getArticlesByDate(LocalDate.now());
    }
}