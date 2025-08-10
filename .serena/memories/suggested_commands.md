### General
*   `task --list`: Show all available tasks.
*   `task up`: Start all services.
*   `task down`: Stop all services.

### Database
*   `task db-up`: Start the PostgreSQL and Redis databases.
*   `task db-shell-postgres`: Connect to the PostgreSQL shell.

### API Server (Java/Spring Boot)
*   `task api-build`: Build the API server.
*   `task api-test`: Run unit tests.
*   `task api-quality-check`: Run all quality checks (tests, coverage, style, etc.).
*   `task api-up`: Start the API server.

### RSS Fetcher (Java/Lambda)
*   `task rss-test`: Run unit tests.
*   `task rss-quality-check`: Run all quality checks.
*   `task rss-lambda-deploy`: Build and deploy the RSS fetcher Lambda.

### Frontend (Next.js)
*   `task frontend-install`: Install dependencies.
*   `task frontend-dev`: Run the frontend in development mode.
*   `task frontend-test`: Run unit tests.
*   `task frontend-lint`: Run the linter.
*   `task frontend-format`: Format the code.
*   `task frontend-quality-check`: Run all quality checks.

### Infrastructure (CDK)
*   `task cdk-install`: Install CDK dependencies.
*   `task cdk-deploy`: Deploy the infrastructure.
*   `task cdk-diff`: Show infrastructure changes.
