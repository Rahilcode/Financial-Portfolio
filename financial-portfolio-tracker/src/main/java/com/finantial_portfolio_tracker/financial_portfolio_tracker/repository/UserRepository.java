package com.finantial_portfolio_tracker.financial_portfolio_tracker.repository;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}