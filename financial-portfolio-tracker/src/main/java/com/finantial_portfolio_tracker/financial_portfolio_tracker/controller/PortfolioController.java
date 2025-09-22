package com.finantial_portfolio_tracker.financial_portfolio_tracker.controller;


import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.*;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.service.PortfolioService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private @NonNull final PortfolioService portfolioService;


    @PostMapping
    public ResponseEntity<PortfolioDto> createPortfolio(@RequestBody CreatePortfolio req, Authentication auth) throws UsernameNotFoundException {
        String username = auth.getName();
        PortfolioDto dto = portfolioService.createPortfolio(username, req.getName());
        return ResponseEntity.status(201).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<PortfolioDto>> getUserPortfolios(Authentication auth) {
        String username = auth.getName();
        List<PortfolioDto> portfolios = portfolioService.getUserPortfolios(username);
        return ResponseEntity.ok(portfolios);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PortfolioDto> getPortfolio(@PathVariable UUID id, Authentication auth) {
        String username = auth.getName();
        PortfolioDto dto = portfolioService.getPortfolio(id, username);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/assets")
    public ResponseEntity<AssetDto> addAsset(@PathVariable UUID id, @RequestBody AddAsset req, Authentication auth) {
        String username = auth.getName();
        AssetDto dto = portfolioService.addAsset(id, req, username);
        return ResponseEntity.status(201).body(dto);
    }

    @DeleteMapping("/{id}/assets/{assetId}")
    public ResponseEntity<?> removeAsset(@PathVariable UUID id, @PathVariable UUID assetId, Authentication auth) {
        String username = auth.getName();
        portfolioService.removeAsset(id, assetId, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/insights")
    public ResponseEntity<InsightDto> getInsights(@PathVariable UUID id, Authentication auth) {
        String username = auth.getName();
        InsightDto insight = portfolioService.getInsights(id, username);
        return ResponseEntity.ok(insight);
    }
}
