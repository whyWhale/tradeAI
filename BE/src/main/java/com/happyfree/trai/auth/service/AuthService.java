package com.happyfree.trai.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.happyfree.trai.user.repository.UserRepository;
import com.happyfree.trai.user.entity.User;

@Service
public class AuthService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;

	public CustomUserDetails getLoginUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof CustomUserDetails) {
			return (CustomUserDetails) principal;
		}

		throw new RuntimeException("현재 로그인한 유저가 없습니다.");
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username).orElseThrow(RuntimeException::new);
		return new CustomUserDetails(user);
	}
}
