package com.finantial_portfolio_tracker.financial_portfolio_tracker.controller;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.AuthDto;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.service.AuthService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private @NonNull final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest req) {
        try {
            String msg = authService.register(req);
            return ResponseEntity.ok(msg);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.JwtResponse> login(@RequestBody AuthDto.LoginRequest req) {
        String token = authService.login(req);
        return ResponseEntity.ok(new AuthDto.JwtResponse(token));
    }
}

