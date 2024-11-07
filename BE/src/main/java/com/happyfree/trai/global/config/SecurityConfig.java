package com.happyfree.trai.global.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.happyfree.trai.auth.filter.JWTFilter;
import com.happyfree.trai.auth.filter.LoginFilter;
import com.happyfree.trai.auth.util.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	private AuthenticationConfiguration authenticationConfiguration;
	@Autowired
	private JWTUtil jwtUtil;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
		throws Exception {
		return configuration.getAuthenticationManager();
	}

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
						configuration.setAllowedOrigins(
							Arrays.asList("http://www.trai-ai.site", "https://www.trai-ai.site",
								"http://localhost:5173", "http://localhost", "https://localhost"));
						configuration.setAllowedMethods(Collections.singletonList("*"));
						configuration.setAllowedHeaders(Collections.singletonList("*"));
						configuration.setAllowCredentials(true);
						configuration.setMaxAge(3600L);
						configuration.addExposedHeader("*");
						configuration.addAllowedMethod("*");
						return configuration;
					}
				}));

		// jwt 권한 필터
		http.addFilterBefore(new JWTFilter(jwtUtil),
			UsernamePasswordAuthenticationFilter.class);

		// 로그인 필터
		http.addFilterAt(
			new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil),
			UsernamePasswordAuthenticationFilter.class);
		http.exceptionHandling((exceptionHandlingConfigurer) ->
			exceptionHandlingConfigurer.authenticationEntryPoint((request, response, authException) -> {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}));

		http
			.authorizeHttpRequests((auth) -> auth
				.requestMatchers("/api/users/login", "/api/users/join", "api/upbits/**","api/users/check*").permitAll()
				.requestMatchers("/swagger", "/h2-console*/", "/h2-console/**", "/swagger-ui.html", "/swagger-ui/**",
					"/api-docs", "/api-docs/**", "/v3/api-docs/**", "/api/swagger-ui/**", "/api/swagger-ui.html",
					"/api/v3/api-docs/**").permitAll()
				.anyRequest().authenticated());

		http.csrf(csrf -> csrf.disable());

		http.userDetailsService(userDetailsService);

		return http.build();
	}
}
