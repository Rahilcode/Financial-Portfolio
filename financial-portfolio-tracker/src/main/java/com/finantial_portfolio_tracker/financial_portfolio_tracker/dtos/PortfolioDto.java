package com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioDto {
    private UUID id;
    private String name;
    private List<AssetDto> assets;
    private BigDecimal totalValue;
}