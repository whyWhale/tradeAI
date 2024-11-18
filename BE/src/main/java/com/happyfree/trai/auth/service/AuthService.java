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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static com.happyfree.trai.global.exception.ErrorCode.USER_NOT_FOUND;

@Service
public class AuthService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;

	public User getLoginUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (!(principal instanceof CustomUserDetails detail)) {
			throw new CustomException(USER_NOT_FOUND);
		}

        User user = userRepository.findByEmail(detail.getUsername())
				.orElseThrow(() -> new CustomException(USER_NOT_FOUND));

		String currentUrl = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest().getRequestURI();

		if ("ROLE_USER".equals(user.getRole()) && !"/api/agent-history/ai".equals(currentUrl)) {
			return userRepository.findFirstByRole("ROLE_ADMIN")
					.orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		}

		return user;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		return new CustomUserDetails(user);
	}

	public String getRole() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (!(principal instanceof CustomUserDetails detail)) {
			throw new CustomException(USER_NOT_FOUND);
		}

		User loginUser = userRepository.findByEmail(detail.getUsername())
			.orElseThrow(() -> new CustomException(USER_NOT_FOUND));
		if (loginUser == null) {
			return null;
		}

		return loginUser.getRole();
	}
}
