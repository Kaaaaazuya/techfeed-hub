package com.techfeed.api.repository;

import com.techfeed.api.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {

    Page<Article> findAllByOrderByPublishedAtDesc(Pageable pageable);

    @Query("SELECT a FROM Article a WHERE a.publishedAt >= :startDate AND a.publishedAt < :endDate ORDER BY a.publishedAt DESC")
    Page<Article> findByPublishedAtBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate,
                                         Pageable pageable);

    @Query("SELECT a FROM Article a WHERE a.blogId = :blogId ORDER BY a.publishedAt DESC")
    Page<Article> findByBlogId(@Param("blogId") String blogId, Pageable pageable);

    @Query(value = """
        SELECT a.*, 
               ts_rank(
                   setweight(to_tsvector('simple', a.title), 'A') ||
                   setweight(to_tsvector('simple', COALESCE(a.content, a.summary, '')), 'B'),
                   plainto_tsquery('simple', :keyword)
               ) as search_rank
        FROM articles a
        WHERE (
            to_tsvector('simple', a.title) @@ plainto_tsquery('simple', :keyword) OR
            to_tsvector('simple', COALESCE(a.content, a.summary, '')) @@ plainto_tsquery('simple', :keyword)
        )
        ORDER BY search_rank DESC, a.published_at DESC
        """, nativeQuery = true)
    Page<Article> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Article a WHERE a.publishedAt >= :startDate AND a.publishedAt < :endDate")
    Long countByPublishedAtBetween(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);
}