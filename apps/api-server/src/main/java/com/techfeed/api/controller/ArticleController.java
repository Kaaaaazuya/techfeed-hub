package com.techfeed.api.controller;

import com.techfeed.api.dto.ArticleResponse;
import com.techfeed.api.dto.PageResponse;
import com.techfeed.api.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<PageResponse<ArticleResponse>> getArticles(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String blogId,
            @RequestParam(required = false) String keyword) {

        PageResponse<ArticleResponse> response;

        if (keyword != null && !keyword.trim().isEmpty()) {
            response = articleService.searchArticles(keyword.trim(), page, size);
        } else if (blogId != null && !blogId.trim().isEmpty()) {
            response = articleService.getArticlesByBlogId(blogId.trim(), page, size);
        } else if (startDate != null && endDate != null) {
            response = articleService.getArticlesByDateRange(startDate, endDate, page, size);
        } else {
            response = articleService.getArticles(page, size);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getArticleById(@PathVariable String id) {
        Optional<ArticleResponse> article = articleService.getArticleById(id);
        return article.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getArticleCount(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        if (startDate != null && endDate != null) {
            Long count = articleService.getArticleCountByDateRange(startDate, endDate);
            return ResponseEntity.ok(count);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}