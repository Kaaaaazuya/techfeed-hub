package rssfetcher.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import rssfetcher.entity.Article;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public class ArticleRepository {
    
    private final EntityManager entityManager;

    public ArticleRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void save(Article article) {
        EntityTransaction transaction = entityManager.getTransaction();
        try {
            transaction.begin();
            if (article.getId() == null) {
                entityManager.persist(article);
            } else {
                entityManager.merge(article);
            }
            transaction.commit();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw new RuntimeException("Failed to save article", e);
        }
    }

    public Optional<Article> findByUrl(String url) {
        try {
            TypedQuery<Article> query = entityManager.createQuery(
                "SELECT a FROM Article a WHERE a.url = :url", Article.class);
            query.setParameter("url", url);
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public List<Article> findByPublishedDate(LocalDate date) {
        ZonedDateTime startOfDay = date.atStartOfDay(java.time.ZoneId.systemDefault());
        ZonedDateTime endOfDay = date.plusDays(1).atStartOfDay(java.time.ZoneId.systemDefault());
        
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a WHERE a.publishedAt >= :startOfDay AND a.publishedAt < :endOfDay ORDER BY a.publishedAt DESC", 
            Article.class);
        query.setParameter("startOfDay", startOfDay);
        query.setParameter("endOfDay", endOfDay);
        return query.getResultList();
    }

    public List<Article> findByBlogId(String blogId) {
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a WHERE a.blogId = :blogId ORDER BY a.publishedAt DESC", 
            Article.class);
        query.setParameter("blogId", blogId);
        return query.getResultList();
    }

    public List<Article> findAll() {
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a ORDER BY a.publishedAt DESC", Article.class);
        return query.getResultList();
    }

    public long count() {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Article a", Long.class);
        return query.getSingleResult();
    }

    public boolean existsByUrl(String url) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Article a WHERE a.url = :url", Long.class);
        query.setParameter("url", url);
        return query.getSingleResult() > 0;
    }

    public boolean existsByUrlHash(String urlHash) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Article a WHERE a.urlHash = :urlHash", Long.class);
        query.setParameter("urlHash", urlHash);
        return query.getSingleResult() > 0;
    }
}