package com.finantial_portfolio_tracker.financial_portfolio_tracker.repository;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {

    Optional<Asset> findByPortfolioIdAndTickerIgnoreCase(UUID portfolioId, String ticker);

}