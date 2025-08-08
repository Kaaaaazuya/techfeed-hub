package rssfetcher.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import rssfetcher.entity.Article;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    public Optional<Article> findByLink(String link) {
        try {
            TypedQuery<Article> query = entityManager.createQuery(
                "SELECT a FROM Article a WHERE a.link = :link", Article.class);
            query.setParameter("link", link);
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public List<Article> findByPublishedDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a WHERE a.publishedDate >= :startOfDay AND a.publishedDate < :endOfDay ORDER BY a.publishedDate DESC", 
            Article.class);
        query.setParameter("startOfDay", startOfDay);
        query.setParameter("endOfDay", endOfDay);
        return query.getResultList();
    }

    public List<Article> findByFeedSource(String feedSource) {
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a WHERE a.feedSource = :feedSource ORDER BY a.publishedDate DESC", 
            Article.class);
        query.setParameter("feedSource", feedSource);
        return query.getResultList();
    }

    public List<Article> findAll() {
        TypedQuery<Article> query = entityManager.createQuery(
            "SELECT a FROM Article a ORDER BY a.publishedDate DESC", Article.class);
        return query.getResultList();
    }

    public long count() {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Article a", Long.class);
        return query.getSingleResult();
    }

    public boolean existsByLink(String link) {
        TypedQuery<Long> query = entityManager.createQuery(
            "SELECT COUNT(a) FROM Article a WHERE a.link = :link", Long.class);
        query.setParameter("link", link);
        return query.getSingleResult() > 0;
    }
}