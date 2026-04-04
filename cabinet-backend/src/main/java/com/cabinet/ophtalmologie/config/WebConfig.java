package com.cabinet.ophtalmologie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Sert les fichiers uploadés depuis le dossier uploads/
        // URL : http://localhost:8081/files/analyses/uuid.jpg
        // Fichier : uploads/analyses/uuid.jpg
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:uploads/");
    }
}