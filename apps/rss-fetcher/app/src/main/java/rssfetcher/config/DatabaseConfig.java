package rssfetcher.config;

public class DatabaseConfig {
    
    private static final String DEFAULT_DB_HOST = "localhost";
    private static final String DEFAULT_DB_PORT = "5432";
    private static final String DEFAULT_DB_NAME = "techfeed_hub";
    private static final String DEFAULT_DB_USER = "techfeed_user";
    private static final String DEFAULT_DB_PASSWORD = "techfeed_password";

    public static String getDbHost() {
        return System.getenv().getOrDefault("DB_HOST", DEFAULT_DB_HOST);
    }

    public static String getDbPort() {
        return System.getenv().getOrDefault("DB_PORT", DEFAULT_DB_PORT);
    }

    public static String getDbName() {
        return System.getenv().getOrDefault("DB_NAME", DEFAULT_DB_NAME);
    }

    public static String getDbUser() {
        return System.getenv().getOrDefault("DB_USER", DEFAULT_DB_USER);
    }

    public static String getDbPassword() {
        return System.getenv().getOrDefault("DB_PASSWORD", DEFAULT_DB_PASSWORD);
    }

    public static String getJdbcUrl() {
        return String.format("jdbc:postgresql://%s:%s/%s", 
            getDbHost(), getDbPort(), getDbName());
    }
}