package com.happyfree.trai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${spring.application.name}")
    String applicationName;

    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(applicationName + " API 명세서")
                        .description("Trai AI API Documentation")
                        .version("0.1")
                        .license(new License()
                                .name(applicationName)
                                .url("https://www.trai-ai.site")
                        )
                )
                .servers(List.of(
                        new Server()
                                .url("https://www.trai-ai.site/api")
                                .description("Production server"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development server")
                ));
    }
}