package com.finantial_portfolio_tracker.financial_portfolio_tracker.repository;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.Portfolio;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {

    List<Portfolio> findByOwnerId(UUID ownerId);

    List<Portfolio> findByOwner(User user);
}
