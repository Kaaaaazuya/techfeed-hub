-- TechFeed Hub - Database Initialization
-- Enable required extensions

-- Enable pgcrypto for ULID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable uuid-ossp for UUID support (backup)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable ltree for hierarchical data if needed
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Enable pg_trgm for better text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable btree_gin for composite indexes
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Enable pg_stat_statements for performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";