package rssfetcher.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseConfigTest {

    @Test
    void getJdbcUrl_ShouldReturnValidUrl() {
        // When
        String jdbcUrl = DatabaseConfig.getJdbcUrl();

        // Then
        assertNotNull(jdbcUrl);
        assertTrue(jdbcUrl.startsWith("jdbc:postgresql://"));
    }

    @Test
    void getDbUser_ShouldReturnUsername() {
        // When
        String username = DatabaseConfig.getDbUser();

        // Then
        assertNotNull(username);
        assertFalse(username.isEmpty());
    }

    @Test
    void getDbPassword_ShouldReturnPassword() {
        // When
        String password = DatabaseConfig.getDbPassword();

        // Then
        assertNotNull(password);
        assertFalse(password.isEmpty());
    }
}