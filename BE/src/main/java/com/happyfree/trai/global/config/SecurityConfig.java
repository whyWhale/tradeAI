package com.happyfree.trai.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // 모든 요청을 허용
				.csrf().disable() // CSRF 비활성화
				.formLogin().disable() // 폼 로그인 비활성화
				.logout().disable(); // 로그아웃 비활성화

		return http.build();
	}

	// BCryptPasswordEncoder를 빈으로 등록
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}


//package com.happyfree.trai.global.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//	@Bean
//	public BCryptPasswordEncoder bCryptPasswordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//
//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//		http
//				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // 모든 요청을 허용
//				.csrf().disable() // CSRF 비활성화
//				.formLogin().disable() // 폼 로그인 비활성화
//				.logout().disable(); // 로그아웃 비활성화
//
//		return http.build();
//	}
//}


//package com.happyfree.trai.global.config;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//		http
//				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // 모든 요청에 대한 인증 해제
//				.csrf(csrf -> csrf.disable()) // CSRF 비활성화
//				.formLogin(form -> form.disable()) // 폼 로그인 비활성화
//				.logout(logout -> logout.disable()); // 로그아웃 비활성화
//
//		return http.build();
//	}
//}
//
//
//
//
////package com.happyfree.trai.global.config;
////
//import static jakarta.servlet.http.HttpServletResponse.SC_OK;
//import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
//
//import java.util.Arrays;
//import java.util.Collections;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//import com.happyfree.trai.user.repository.UserRepository;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.extern.slf4j.Slf4j;
//
//@Slf4j
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//	@Autowired
//	private UserRepository userRepository;
//
//	@Autowired
//	private UserDetailsService userDetailsService;
//
//	@Bean
//	public BCryptPasswordEncoder bCryptPasswordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//
//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//		http
//			.cors((cors) -> cors
//				.configurationSource(new CorsConfigurationSource() {
//
//					@Override
//					public CorsConfiguration getCorsConfiguration(
//						HttpServletRequest request) {
//						CorsConfiguration configuration = new CorsConfiguration();
//						configuration.setAllowedOrigins(
//							Arrays.asList("http://www.trai-ai.site", "https://www.trai-ai.site",
//								"http://localhost:5173","http://localhost","https://localhost"));
//						configuration.setAllowedMethods(Collections.singletonList("*"));
//						configuration.setAllowedHeaders(Collections.singletonList("*"));
//						configuration.setAllowCredentials(true);
//						configuration.setMaxAge(3600L);
//						configuration.addExposedHeader("*");
//						configuration.addAllowedMethod("*");
//						return configuration;
//					}
//
//				}));
//		http
//			.formLogin(form -> form.successHandler((request, response, authentication) -> {
//						response.setStatus(SC_OK);
//						String setCookieHeader = response.getHeader("Set-Cookie");
//						if (setCookieHeader != null) {
//							response.setHeader("Set-Cookie", setCookieHeader + "; SameSite=Lax");
//						}
//					}).loginProcessingUrl("/api/users/login")
//					.failureHandler((request, response, exception) -> {
//						log.error("login unauthorized------------------------------------------");
//						response.setStatus(SC_UNAUTHORIZED);
//					})
//					.permitAll()
//			)
//			.logout(logout -> logout.logoutSuccessHandler((request, response, authentication) -> {
//					response.setStatus(HttpServletResponse.SC_OK);
//				}).logoutUrl("/api/users/logout")
//			);
//
//		http.exceptionHandling((exceptionHandlingConfigurer) ->
//			exceptionHandlingConfigurer.authenticationEntryPoint((request, response, authException) -> {
//				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//			}));
//
//		http
//			.authorizeHttpRequests((auth) -> auth
//				.requestMatchers("/api/users/login", "/api/users/join", "api/upbits/**").permitAll()
//				.requestMatchers("/swagger", "/h2-console*/", "/h2-console/**", "/swagger-ui.html", "/swagger-ui/**",
//					"/api-docs", "/api-docs/**", "/v3/api-docs/**", "/api/swagger-ui/**", "/api/swagger-ui.html",
//					"/api/v3/api-docs/**").permitAll()
//				.anyRequest().authenticated());
//
//		http.csrf(csrf -> csrf.disable());
//
//		http.userDetailsService(userDetailsService);
//
//		return http.build();
//	}
//}
