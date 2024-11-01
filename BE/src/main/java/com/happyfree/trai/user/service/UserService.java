package com.happyfree.trai.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	UserRepository userRepository;

	public void save(SignUp signUp) {
		userRepository.save(User.builder().email(signUp.getUsername()).password(bCryptPasswordEncoder.encode(signUp.getPassword())).role("ROLE_USER").build());
	}

}
