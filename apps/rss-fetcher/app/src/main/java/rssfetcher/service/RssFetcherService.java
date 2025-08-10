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
import java.time.ZonedDateTime;
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
                ZonedDateTime publishedAt = convertToZonedDateTime(entry.getPublishedDate());
                if (targetDate != null && publishedAt != null) {
                    LocalDate publishedLocalDate = publishedAt.toLocalDate();
                    if (!publishedLocalDate.equals(targetDate)) {
                        skippedCount++;
                        continue;
                    }
                }

                // 重複チェック（URLハッシュで効率的に判定）
                String urlHash = calculateUrlHash(entry.getLink());
                if (articleRepository.existsByUrlHash(urlHash)) {
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
        String url = entry.getLink();
        String content = entry.getDescription() != null ? entry.getDescription().getValue() : null;
        String summary = content; // 現在はcontentと同じにする
        String author = entry.getAuthor();
        ZonedDateTime publishedAt = convertToZonedDateTime(entry.getPublishedDate());
        
        // デフォルトのblogIdを使用（実際の実装では適切なblogIdを取得する必要がある）
        String blogId = "01HXXXXXXXXXXXXXXXXXXXXXXX"; // 実際のテストblogId

        return new Article(blogId, title, url, content, summary, author, publishedAt);
    }

    private ZonedDateTime convertToZonedDateTime(Date date) {
        if (date == null) {
            return ZonedDateTime.now();
        }
        return date.toInstant().atZone(ZoneId.systemDefault());
    }

    private String calculateUrlHash(String url) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(url.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    public List<Article> getArticlesByDate(LocalDate date) {
        return articleRepository.findByPublishedDate(date);
    }

    public List<Article> getTodaysArticles() {
        return getArticlesByDate(LocalDate.now());
    }
}