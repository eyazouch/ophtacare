# =============================================
# Dockerfile — Backend Spring Boot
# =============================================

# Étape 1 : Build avec Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale légère
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Créer le dossier uploads
RUN mkdir -p /app/uploads/analyses

# Copier le jar buildé
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
