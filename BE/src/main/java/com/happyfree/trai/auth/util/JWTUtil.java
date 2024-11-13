package com.happyfree.trai.auth.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JWTUtil {

    private Long accessExpired=Long.MAX_VALUE;


    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret){
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getEmail(String token){
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }

    public String getUsername(String token){
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    public String getRole(String token){
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public Boolean isExpired(String token) {
        try {
            Date expirationDate = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();

            boolean isExpired = expirationDate.before(new Date());
            if (isExpired) {
                log.info("Token is expired. Expiration date: {}", expirationDate);
            }
            return isExpired;
        } catch (ExpiredJwtException e) {
            log.warn("Token is already expired", e);
            return true;
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty", e);
            return true;
        } catch (JwtException e) {
            log.error("JWT validation error", e);
            return true;
        } catch (Exception e) {
            log.error("Unexpected error during JWT validation", e);
            return true;
        }
    }

    public String getCategory(String token){

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    public String createAccessJwt(String category, String username, String role) {

        return Jwts.builder()
                .claim("category", category)
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpired))
                .signWith(secretKey)
                .compact();
    }
}
