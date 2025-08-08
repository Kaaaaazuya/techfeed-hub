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

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/app/build/libs/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]