package rssfetcher.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import rssfetcher.batch.RssBatchProcessor;

import java.time.LocalDate;
import java.util.Map;

public class RssLambdaHandler implements RequestHandler<Map<String, Object>, String> {

    @Override
    public String handleRequest(Map<String, Object> event, Context context) {
        String functionName = context.getFunctionName();
        String requestId = context.getAwsRequestId();
        
        context.getLogger().log(String.format(
            "Starting RSS fetching Lambda: %s, RequestId: %s",
            functionName, requestId
        ));
        
        try {
            // Lambda環境変数から設定を取得
            String dbHost = System.getenv("DB_HOST");
            String dbPort = System.getenv("DB_PORT");
            String dbName = System.getenv("DB_NAME");
            
            if (dbHost == null || dbPort == null || dbName == null) {
                throw new RuntimeException("Missing required environment variables: DB_HOST, DB_PORT, DB_NAME");
            }
            
            context.getLogger().log(String.format(
                "Database connection: %s:%s/%s", dbHost, dbPort, dbName
            ));
            
            // デフォルトは今日の日付、イベントから指定がある場合はそれを使用
            LocalDate targetDate = LocalDate.now();
            if (event.containsKey("date")) {
                try {
                    targetDate = LocalDate.parse(event.get("date").toString());
                    context.getLogger().log("Processing RSS feeds for date: " + targetDate);
                } catch (Exception e) {
                    context.getLogger().log("Invalid date format in event, using today: " + e.getMessage());
                }
            } else {
                context.getLogger().log("Processing RSS feeds for today: " + targetDate);
            }
            
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
            context.getLogger().log("Stack trace: " + java.util.Arrays.toString(e.getStackTrace()));
            
            throw new RuntimeException(errorMessage, e);
        }
    }
}