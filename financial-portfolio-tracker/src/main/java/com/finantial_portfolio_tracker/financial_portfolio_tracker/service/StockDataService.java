package com.finantial_portfolio_tracker.financial_portfolio_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;


public interface StockDataService {
    BigDecimal getCurrentPrice(String ticker);
    Map<LocalDate, BigDecimal> getHistoricalPrices(String ticker, int days);
}