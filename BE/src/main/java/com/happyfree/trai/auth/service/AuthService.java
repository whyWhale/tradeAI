package com.happyfree.trai.auth.service;

import com.happyfree.trai.global.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.happyfree.trai.auth.detail.CustomUserDetails;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;

import static com.happyfree.trai.global.exception.ErrorCode.USER_NOT_FOUND;

@Service
public class AuthService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;

	public User getLoginUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof CustomUserDetails) {
			CustomUserDetails detail = (CustomUserDetails)principal;
			return userRepository.findByEmail(detail.getUsername()).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		}

		throw new CustomException(USER_NOT_FOUND);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		return new CustomUserDetails(user);
	}
}
