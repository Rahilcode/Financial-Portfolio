package com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetDto {
    private UUID id;
    private String ticker;
    private Double quantity;
    private BigDecimal avgPrice;
    private BigDecimal currentPrice;
    private BigDecimal totalValue;
}
