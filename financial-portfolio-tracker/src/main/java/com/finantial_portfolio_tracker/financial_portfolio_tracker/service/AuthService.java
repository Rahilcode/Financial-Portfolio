package com.finantial_portfolio_tracker.financial_portfolio_tracker.service;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.config.JwtTokenProvider;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.AuthDto;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.User;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authManager;

    public String register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new RuntimeException("Username already in use");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .username(req.username())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role("USER")
                .build();

        userRepository.save(user);
        return "User Registered Successfully!";
    }

    public String login(AuthDto.LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );
        return tokenProvider.generateToken(req.username());
    }
}