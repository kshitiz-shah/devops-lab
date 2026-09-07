# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/retail-app-0.0.1-SNAPSHOT.jar app.jar
# Expose the web port
EXPOSE 8080
# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
