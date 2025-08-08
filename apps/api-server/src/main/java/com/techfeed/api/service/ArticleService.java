package com.techfeed.api.service;

import com.techfeed.api.dto.ArticleResponse;
import com.techfeed.api.dto.PageResponse;
import com.techfeed.api.entity.Article;
import com.techfeed.api.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public PageResponse<ArticleResponse> getArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articles = articleRepository.findAllByOrderByPublishedAtDesc(pageable);
        
        Page<ArticleResponse> articleResponses = articles.map(ArticleResponse::from);
        return PageResponse.from(articleResponses);
    }

    public PageResponse<ArticleResponse> getArticlesByDateRange(
            LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articles = articleRepository.findByPublishedAtBetween(startDate, endDate, pageable);
        
        Page<ArticleResponse> articleResponses = articles.map(ArticleResponse::from);
        return PageResponse.from(articleResponses);
    }

    public PageResponse<ArticleResponse> getArticlesByBlogId(String blogId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articles = articleRepository.findByBlogId(blogId, pageable);
        
        Page<ArticleResponse> articleResponses = articles.map(ArticleResponse::from);
        return PageResponse.from(articleResponses);
    }

    public PageResponse<ArticleResponse> searchArticles(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articles = articleRepository.findByKeyword(keyword, pageable);
        
        Page<ArticleResponse> articleResponses = articles.map(ArticleResponse::from);
        return PageResponse.from(articleResponses);
    }

    public Optional<ArticleResponse> getArticleById(String id) {
        return articleRepository.findById(id)
                .map(ArticleResponse::from);
    }

    public Long getArticleCountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return articleRepository.countByPublishedAtBetween(startDate, endDate);
    }
}