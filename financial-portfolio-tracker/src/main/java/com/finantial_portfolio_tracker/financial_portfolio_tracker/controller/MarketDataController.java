package com.finantial_portfolio_tracker.financial_portfolio_tracker.controller;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.service.PortfolioService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/market-data")
@RequiredArgsConstructor
public class MarketDataController {

    private @NonNull final PortfolioService portfolioService;


    @GetMapping("/{id}/assets/{ticker}/history")
    public ResponseEntity<Map<String, BigDecimal>> getHistory(@PathVariable UUID id,
                                                              @PathVariable String ticker,
                                                              @RequestParam(defaultValue = "30") int days,
                                                              Authentication auth) {
        String username = auth.getName();
        portfolioService.getPortfolio(id, username);
        Map<LocalDate, BigDecimal> hist = portfolioService.getHistoricalForTicker(ticker, days);
        Map<String, BigDecimal> out = new LinkedHashMap<>();
        hist.forEach((k,v) -> out.put(k.toString(), v));
        return ResponseEntity.ok(out);
    }


}
