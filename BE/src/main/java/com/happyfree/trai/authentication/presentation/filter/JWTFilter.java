package com.happyfree.trai.authentication.presentation.filter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

import com.happyfree.trai.authentication.domain.CustomUserDetails;
import com.happyfree.trai.authentication.provider.JwtProvider;
import com.happyfree.trai.user.domain.User;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JWTFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String accessToken = request.getHeader("access");
        if (accessToken == null) {
            filterChain.doFilter(request, response);
            log.error("access 토큰이 존재하지 않습니다. access token: {}", accessToken);
            return;
        }
        try {
            jwtProvider.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            log.error("access 토큰이 만료되었습니다. accessToken: {}", accessToken);
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String category = jwtProvider.getCategory(accessToken);
        if (!category.equals("access")) {
            log.error("access 토큰이 정확하지 않습니다. access token: {}", accessToken);
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String username = jwtProvider.getUsername(accessToken);
        String role = jwtProvider.getRole(accessToken);
        User userEntity = User.builder()
                .email(username)
                .role(role)
                .build();
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
                customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
