package com.happyfree.trai.global.config;

import static jakarta.servlet.http.HttpServletResponse.SC_OK;
import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;

import java.util.Arrays;
import java.util.Collections;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.happyfree.trai.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private String allowedOrigins = "https://localhost:8080";

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
			.cors((cors) -> cors
				.configurationSource(new CorsConfigurationSource() {

					@Override
					public CorsConfiguration getCorsConfiguration(
						HttpServletRequest request) {
						CorsConfiguration configuration = new CorsConfiguration();
						configuration.setAllowedOrigins(Arrays.asList(allowedOrigins, "https://www.trai-ai.site"));
						configuration.addAllowedOriginPattern("http://localhost:5173");
						configuration.addAllowedOriginPattern("http://localhost:5173/");
						configuration.setAllowedMethods(Collections.singletonList("*"));
						configuration.setAllowedHeaders(Collections.singletonList("*"));
						configuration.setAllowCredentials(true);
						configuration.setMaxAge(3600L);
						return configuration;
					}

				}));
		http
			.formLogin(form -> form.successHandler((request, response, authentication) -> {
						response.setStatus(SC_OK);
					}).loginProcessingUrl("/api/users/login")
					.failureHandler((request, response, exception) -> {
						log.error("login unauthorized------------------------------------------");
						response.setStatus(SC_UNAUTHORIZED);
					})
					.permitAll()
			)
			.logout(logout -> logout.logoutSuccessHandler((request, response, authentication) -> {
					response.setStatus(HttpServletResponse.SC_OK);
				}).logoutUrl("/api/users/logout")
			);

		http.exceptionHandling((exceptionHandlingConfigurer) ->
			exceptionHandlingConfigurer.authenticationEntryPoint((request, response, authException) -> {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}));

		http
			.authorizeHttpRequests((auth) -> auth
				.requestMatchers("/api/users/login", "/api/users/join").permitAll()
				.requestMatchers("/swagger", "/h2-console*/", "/h2-console/**", "/swagger-ui.html", "/swagger-ui/**",
					"/api-docs", "/api-docs/**", "/v3/api-docs/**", "/api/swagger-ui/**", "/api/swagger-ui.html",
					"/api/v3/api-docs/**").permitAll()
				.anyRequest().authenticated());

		http.csrf(csrf -> csrf.disable());

		http.userDetailsService(userDetailsService);

		return http.build();
	}
}
