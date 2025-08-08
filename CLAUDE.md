# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechFeed Hub is an AI-summarized, personalizable tech blog aggregation service for engineers. The system fetches RSS feeds, stores articles in a PostgreSQL database, and provides a foundation for future AI summarization features.

## Architecture

### Tech Stack
- **RSS Fetcher**: Java 21 with Gradle, Hibernate JPA, Rome RSS library
- **Database**: PostgreSQL 15 with Redis 7 for caching
- **Frontend**: Next.js + TypeScript (planned)
- **Backend API**: Java Spring Boot (planned)
- **Infrastructure**: AWS (Lambda, RDS, S3, EventBridge, App Runner), Docker

### Directory Structure
- `/apps/rss-fetcher/` - Java batch RSS processing application
- `/docker/postgres/init/` - Database schema, functions, and initialization scripts
- `/infra/` - Infrastructure as code (CDK)
- `/packages/` - Shared packages (future)

## Key Commands

### Task-based Development
The project uses [Task](https://taskfile.dev/) for command management. Use `task` or `task --list` to see available commands.

#### Database Management
```bash
task db-up          # Start PostgreSQL + Redis
task db-down        # Stop database services
task db-restart     # Restart database services
task db-shell-postgres  # Connect to PostgreSQL shell
```

#### RSS Fetcher Development
```bash
cd apps/rss-fetcher
task build          # Build Java application with Gradle
task test           # Run tests
task run            # Run application locally
task lint           # Run code quality checks (./gradlew check)
```

#### RSS Batch Processing
```bash
task rss-build           # Build RSS fetcher Docker image
task rss-batch-today     # Process today's RSS articles
task rss-batch-all       # Process all RSS articles
task rss-batch-date -- 2025-08-07  # Process articles for specific date
```

#### Full Stack Operations
```bash
task up            # Start all services
task down          # Stop all services
task status        # Check all services status
```

## Database Architecture

### Core Tables
- **articles** - Main articles table (partitioned by published_at)
- **blogs** - RSS feed sources with metadata
- **tags** / **tag_categories** - Tag management system
- **users** / **user_sessions** - User management (future)

### Key Features
- ULID primary keys for security and performance
- Monthly partitioning on articles and audit logs
- Full-text search with GIN indexes
- Comprehensive security audit logging

### Connection Info (Development)
```
PostgreSQL: localhost:5432/techfeed_hub (techfeed_user/techfeed_password)
Redis: localhost:6379
```

## Java Application Details

### Main Classes
- `RssBatchProcessor` - Entry point for RSS batch processing
- `RssFetcherService` - Core RSS fetching and article processing logic
- `ArticleRepository` - JPA repository for article operations
- `Article` entity - JPA entity representing articles

### RSS Processing Flow
1. Fetch RSS feed using Rome library
2. Parse entries and check for duplicates by URL
3. Filter by date if specified
4. Save new articles to PostgreSQL with Hibernate
5. Log processing statistics

### Dependencies
- Rome RSS library for feed parsing
- Hibernate 6.4.1 for JPA/ORM
- PostgreSQL JDBC driver
- HikariCP for connection pooling
- JUnit Jupiter for testing

## Development Guidelines

### Code Conventions
- Java 21 language features
- JPA entities with proper relationships
- Comprehensive error handling and logging
- Transaction management with EntityManager

### Testing Strategy
- Use `./gradlew test` for unit tests
- Integration tests should use test database setup
- RSS feed processing tests with mock feeds

### Docker Development
- Local development uses docker-compose for databases
- RSS fetcher runs as batch job with Docker profile
- All services connected via techfeed-network

### Database Migrations
- Schema changes go in `/docker/postgres/init/` SQL files
- Partitioning and indexing handled in separate numbered scripts
- Sample data provided in `08-sample-data.sql`