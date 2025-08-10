package rssfetcher.aws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import java.util.logging.Logger;

public class DatabaseSecrets {
    private static final Logger logger = Logger.getLogger(DatabaseSecrets.class.getName());
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static class DatabaseCredentials {
        public final String username;
        public final String password;

        public DatabaseCredentials(String username, String password) {
            this.username = username;
            this.password = password;
        }
    }

    public static DatabaseCredentials getCredentials(String secretArn) {
        try {
            SecretsManagerClient client = SecretsManagerClient.builder()
                    .region(Region.US_EAST_1)
                    .build();

            GetSecretValueRequest request = GetSecretValueRequest.builder()
                    .secretId(secretArn)
                    .build();

            GetSecretValueResponse response = client.getSecretValue(request);
            String secretString = response.secretString();

            logger.info("Successfully retrieved database credentials from Secrets Manager");

            JsonNode secretJson = objectMapper.readTree(secretString);
            String username = secretJson.get("username").asText();
            String password = secretJson.get("password").asText();

            return new DatabaseCredentials(username, password);

        } catch (Exception e) {
            logger.severe("Failed to retrieve database credentials: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve database credentials", e);
        }
    }
}