package rssfetcher;

import java.net.URL;
import java.net.URI;
import java.util.List;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import com.rometools.rome.io.FeedException;

public class RssReader {

    public static void main(String[] args) {
        String feedUrl = "https://yamadashy.github.io/tech-blog-rss-feed/feeds/rss.xml";

        try {
            // フィードの取得
            URL url = URI.create(feedUrl).toURL();
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(url));

            System.out.println("Feed Title: " + feed.getTitle());
            System.out.println("Feed Description: " + feed.getDescription());

            // 各エントリ（記事）の処理
            List<SyndEntry> entries = feed.getEntries();
            for (SyndEntry entry : entries) {
                System.out.println("----");
                System.out.println("Title: " + entry.getTitle());
                System.out.println("Link: " + entry.getLink());
                System.out.println("Published Date: " + entry.getPublishedDate());
            }

        } catch (FeedException fe) {
            System.err.println("Failed to parse the feed: " + fe.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
