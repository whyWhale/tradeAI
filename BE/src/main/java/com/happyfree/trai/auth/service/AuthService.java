package com.happyfree.trai.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;

@Service
public class AuthService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;

	public User getLoginUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof CustomUserDetails) {
			CustomUserDetails detail = (CustomUserDetails)principal;
			return userRepository.findByEmail(detail.getUsername()).orElseThrow(RuntimeException::new);
		}

		throw new RuntimeException("현재 로그인한 유저가 없습니다.");
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username).orElseThrow(RuntimeException::new);
		return new CustomUserDetails(user);
	}
}
