# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechFeed Hub is an AI-summarized, personalizable tech blog aggregation service for engineers. The system fetches RSS feeds, stores articles in a PostgreSQL database, and provides REST APIs and frontend for article browsing.

## Architecture

### Tech Stack
- **RSS Fetcher**: Java 21 with Gradle, Hibernate JPA, Rome RSS library
- **API Server**: Spring Boot 3.3.4 with JPA, PostgreSQL
- **Frontend**: Next.js 15.4.6 with TypeScript, Tailwind CSS, Storybook
- **Database**: PostgreSQL 15 with Redis 7 for caching
- **Infrastructure**: AWS (Lambda, RDS, S3, EventBridge, App Runner), Docker, CDK
- **Testing**: JUnit Jupiter (Java), Vitest + Playwright (Frontend)

### Directory Structure
- `/apps/rss-fetcher/` - Java batch RSS processing application
- `/apps/api-server/` - Spring Boot REST API server
- `/apps/frontend/` - Next.js frontend application
- `/docker/postgres/init/` - Database schema, functions, and initialization scripts
- `/infra/` - Infrastructure as code (CDK with TypeScript)
- `/config/` - Shared quality check configurations (Checkstyle, PMD, SpotBugs)

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

#### API Server Development
```bash
task api-build          # Build API server with Gradle
task api-test           # Run unit tests
task api-quick-check    # Run tests + coverage
task api-quality-check  # Run all quality checks (tests + static analysis)
task api-coverage       # Generate test coverage report
```

#### RSS Fetcher Development
```bash
task rss-test           # Run unit tests
task rss-test-watch     # Run tests in continuous mode
task rss-coverage       # Generate test coverage report
task rss-lint           # Run static analysis (Checkstyle, PMD, SpotBugs)
task rss-quality-check  # Run all quality checks
task rss-quick-check    # Run tests + coverage only
task rss-build-jar      # Build standalone JAR
task rss-run-local      # Run RSS fetcher locally (requires database)
```

#### Frontend Development
```bash
task frontend-install        # Install dependencies
task frontend-dev            # Run development server
task frontend-build-static   # Build for static export
task frontend-lint           # Run ESLint
task frontend-format         # Format code with Prettier
task frontend-test           # Run unit tests (Vitest)
task frontend-test-e2e       # Run E2E tests (Playwright)
task frontend-quality-check  # Run all quality checks
task frontend-storybook      # Start Storybook development server
task frontend-analyze        # Analyze bundle size
```

#### RSS Batch Processing
```bash
task rss-build           # Build RSS fetcher Docker image
task rss-batch-today     # Process today's RSS articles
task rss-batch-all       # Process all RSS articles
task rss-batch-date -- 2025-08-07  # Process articles for specific date
```

#### CDK Infrastructure Operations
```bash
task cdk-install         # Install CDK dependencies
task cdk-build          # Build CDK project
task cdk-test           # Run all CDK tests
task cdk-test-unit      # Run CDK unit tests only
task cdk-test-integration # Run CDK integration tests only
task cdk-test-watch     # Run CDK tests in watch mode
task cdk-diff           # Show CDK deployment differences
task cdk-synth          # Synthesize CDK templates
task cdk-deploy         # Deploy CDK stack (with pre-deployment tests)
task cdk-destroy        # Destroy CDK stack
```

#### Docker Operations
```bash
task api-up         # Start API server with database
task frontend-up    # Start frontend with API server
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

## Application Architecture

### API Server (Spring Boot)
- **Main Entry**: `TechFeedApiApplication.java`
- **Controllers**: REST endpoints in `controller/` package
- **Services**: Business logic in `service/` package  
- **Repositories**: JPA repositories in `repository/` package
- **DTOs**: Response objects in `dto/` package
- **Entities**: JPA entities in `entity/` package
- **Configuration**: Spring Boot auto-configuration with `application.yml`

### RSS Fetcher (Batch Processing)
- **Main Classes**: `RssBatchProcessor`, `RssFetcherService`, `ArticleRepository`
- **RSS Processing Flow**: Fetch RSS → Parse → Check duplicates → Filter by date → Save to DB
- **Dependencies**: Rome RSS library, Hibernate 6.4.1, PostgreSQL JDBC

### Frontend (Next.js)
- **App Router**: Route handlers in `src/app/` directory
- **Components**: Reusable UI components in `src/components/`
- **API Client**: SWR-based data fetching in `src/lib/api.ts`
- **Styling**: Tailwind CSS with component-scoped styles
- **Testing**: Vitest for unit tests, Playwright for E2E

## Development Guidelines

### Code Conventions
- Java 21 language features
- JPA entities with proper relationships
- Comprehensive error handling and logging
- Transaction management with EntityManager

### Quality Assurance
- **Java**: Checkstyle, PMD, SpotBugs static analysis with shared configurations
- **Coverage**: JaCoCo for Java, built-in coverage for frontend  
- **Testing**: JUnit Jupiter (Java), Vitest + Testing Library (React), Playwright (E2E)
- **Integration**: Testcontainers for database integration tests

### Development Environment
- **Database**: Local PostgreSQL + Redis via docker-compose
- **API Server**: Spring Boot with hot reload, H2 for tests
- **Frontend**: Next.js dev server with fast refresh
- **RSS Fetcher**: Can run locally or as Docker batch job

### Database Management
- **Schema**: Versioned SQL files in `/docker/postgres/init/`
- **Partitioning**: Monthly partitioning on articles and audit logs
- **Sample Data**: Pre-loaded via `08-sample-data.sql`
- **Access**: Use `task db-shell-postgres` for direct database access