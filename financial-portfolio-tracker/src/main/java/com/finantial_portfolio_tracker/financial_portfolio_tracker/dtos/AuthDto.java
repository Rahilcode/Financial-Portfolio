package com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class AuthDto {
    public record RegisterRequest(String username, String email, String password) {

    }
    public record LoginRequest(String username, String password) {

    }
    public record JwtResponse(String token) {

    }
}
