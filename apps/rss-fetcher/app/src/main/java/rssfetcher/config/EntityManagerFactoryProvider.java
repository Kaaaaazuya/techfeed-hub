package rssfetcher.config;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.util.HashMap;
import java.util.Map;

public class EntityManagerFactoryProvider {

    public static EntityManagerFactory createEntityManagerFactory() {
        Map<String, String> properties = new HashMap<>();
        
        // Database connection properties from environment variables
        properties.put("jakarta.persistence.jdbc.url", DatabaseConfig.getJdbcUrl());
        properties.put("jakarta.persistence.jdbc.user", DatabaseConfig.getDbUser());
        properties.put("jakarta.persistence.jdbc.password", DatabaseConfig.getDbPassword());
        
        return Persistence.createEntityManagerFactory("rssFetcherPU", properties);
    }
}