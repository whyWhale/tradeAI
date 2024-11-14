package com.happyfree.trai.user.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.user.dto.InvestmentType;
import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

	private final AuthService authService;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	private final UserRepository userRepository;

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

	public String saveInvestmentType(InvestmentType investmentType) {
		User loginUser = authService.getLoginUser();
		loginUser.updateInvestmentType(investmentType.getInvestmentType());
		userRepository.save(loginUser);

		return loginUser.getInvestmentType();
	}

	public String it() {
		User loginUser = authService.getLoginUser();
		return userRepository.findById(loginUser.getId()).get().getInvestmentType();
	}
}
