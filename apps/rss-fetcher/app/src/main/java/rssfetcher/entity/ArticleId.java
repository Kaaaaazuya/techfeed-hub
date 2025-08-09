package rssfetcher.entity;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class ArticleId implements Serializable {
    private String id;
    private ZonedDateTime publishedAt;

    public ArticleId() {}

    public ArticleId(String id, ZonedDateTime publishedAt) {
        this.id = id;
        this.publishedAt = publishedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ZonedDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(ZonedDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArticleId articleId = (ArticleId) o;
        return Objects.equals(id, articleId.id) && Objects.equals(publishedAt, articleId.publishedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, publishedAt);
    }
}