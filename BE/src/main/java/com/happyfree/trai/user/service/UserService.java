package com.happyfree.trai.user.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.happyfree.trai.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

	private final AuthService authService;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	private final UserRepository userRepository;

	public String createToken() {
		User loginUser = authService.getLoginUser();
		return "Bearer " + JWT.create()
				.withClaim("access_key", loginUser.getAccessKey())
				.withClaim("nonce", UUID.randomUUID().toString())
				.sign(Algorithm.HMAC256(loginUser.getSecretKey()));
	}

	public void save(SignUp signUp) {
		userRepository.save(User.builder()
				.email(signUp.getUsername())
				.password(bCryptPasswordEncoder.encode(signUp.getPassword()))
				.role("ROLE_USER")
				.build());
	}

	public String getAccountInfo() {
		User loginUser = authService.getLoginUser();
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();

		String sign = JWT.create()
				.withClaim("access_key", loginUser.getAccessKey())
				.withClaim("nonce", UUID.randomUUID().toString())
				.sign(Algorithm.HMAC256(loginUser.getSecretKey()));

		String authToken = "Bearer " + sign;
		headers.set("Authorization", authToken);
		headers.set("Content-Type", "application/json");

		HttpEntity<String> entity = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange(
				"https://api.upbit.com/v1/accounts",
				HttpMethod.GET,
				entity,
				String.class
		);

		return response.getBody();
	}

	public boolean findByEmail(String email) {
		Optional<User> byEmail = userRepository.findByEmail(email);
		if (byEmail.isPresent()) {
			return false;
		}

		return true;
	}
}
