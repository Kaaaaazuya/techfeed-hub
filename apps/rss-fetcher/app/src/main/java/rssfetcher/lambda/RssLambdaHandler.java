package rssfetcher.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.ScheduledEvent;
import rssfetcher.aws.DatabaseSecrets;
import rssfetcher.batch.RssBatchProcessor;

import java.time.LocalDate;
import java.util.Map;

public class RssLambdaHandler implements RequestHandler<ScheduledEvent, String> {

    @Override
    public String handleRequest(ScheduledEvent event, Context context) {
        String functionName = context.getFunctionName();
        String requestId = context.getAwsRequestId();
        
        context.getLogger().log(String.format(
            "Starting RSS fetching Lambda: %s, RequestId: %s, EventSource: %s",
            functionName, requestId, event.getSource()
        ));
        
        try {
            // Lambda環境変数から設定を取得
            String dbHost = System.getenv("DB_HOST");
            String dbPort = System.getenv("DB_PORT");
            String dbName = System.getenv("DB_NAME");
            String dbSecretArn = System.getenv("DB_SECRET_ARN");
            
            if (dbHost == null || dbPort == null || dbName == null || dbSecretArn == null) {
                throw new RuntimeException("Missing required environment variables: DB_HOST, DB_PORT, DB_NAME, DB_SECRET_ARN");
            }
            
            // Secrets Manager から認証情報を取得
            context.getLogger().log("Retrieving database credentials from Secrets Manager...");
            DatabaseSecrets.DatabaseCredentials credentials = DatabaseSecrets.getCredentials(dbSecretArn);
            
            context.getLogger().log(String.format(
                "Database connection: %s:%s/%s (User: %s)", dbHost, dbPort, dbName, credentials.username
            ));
            
            // EventBridge detail から日付を取得、なければ今日の日付を使用
            LocalDate targetDate = LocalDate.now();
            Map<String, Object> detail = event.getDetail();
            
            if (detail != null && detail.containsKey("date")) {
                try {
                    targetDate = LocalDate.parse(detail.get("date").toString());
                    context.getLogger().log("Processing RSS feeds for specified date: " + targetDate);
                } catch (Exception e) {
                    context.getLogger().log("Invalid date format in event detail, using today: " + e.getMessage());
                }
            } else {
                context.getLogger().log("Processing RSS feeds for today: " + targetDate);
            }
            
            // EventBridge event information をログ出力
            context.getLogger().log(String.format(
                "EventBridge Event - ID: %s, Source: %s, DetailType: %s, Time: %s",
                event.getId(), event.getSource(), event.getDetailType(), event.getTime()
            ));
            
            // RSS Batch Processor実行
            String[] args;
            if (targetDate.equals(LocalDate.now())) {
                args = new String[]{}; // 引数なし = 今日の日付
            } else {
                args = new String[]{targetDate.toString()}; // 指定日付
            }
            
            context.getLogger().log("Starting RSS batch processing...");
            RssBatchProcessor.main(args);
            
            String result = String.format(
                "RSS fetching completed successfully for date: %s, RequestId: %s", 
                targetDate, requestId
            );
            context.getLogger().log(result);
            
            return result;
            
        } catch (Exception e) {
            String errorMessage = String.format(
                "RSS fetching failed: %s, RequestId: %s", 
                e.getMessage(), requestId
            );
            context.getLogger().log(errorMessage);
            
            // より詳細なスタックトレースをログ出力
            context.getLogger().log("Exception details:");
            for (StackTraceElement element : e.getStackTrace()) {
                context.getLogger().log("  at " + element.toString());
            }
            
            throw new RuntimeException(errorMessage, e);
        }
    }
}