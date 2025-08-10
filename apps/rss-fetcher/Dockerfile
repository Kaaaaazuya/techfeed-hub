# Build stage
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copy gradle files for dependency caching
COPY gradle ./gradle
COPY gradlew ./gradlew
COPY gradlew.bat ./gradlew.bat
COPY gradle.properties ./gradle.properties
COPY settings.gradle.kts ./settings.gradle.kts

# Copy app build file
COPY app/build.gradle.kts ./app/build.gradle.kts

# Download dependencies
RUN ./gradlew dependencies

# Copy source code
COPY app/src ./app/src

# Build the application
RUN ./gradlew build

# Lambda Runtime stage - AWS Lambda base image for Java
FROM public.ecr.aws/lambda/java:21

# Copy the built jar from the build stage
COPY --from=build /app/app/build/libs/*.jar ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "rssfetcher.lambda.RssLambdaHandler::handleRequest" ]