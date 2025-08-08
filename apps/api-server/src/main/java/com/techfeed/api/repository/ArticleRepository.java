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

    @Query("SELECT a FROM Article a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY a.publishedAt DESC")
    Page<Article> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Article a WHERE a.publishedAt >= :startDate AND a.publishedAt < :endDate")
    Long countByPublishedAtBetween(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);
}