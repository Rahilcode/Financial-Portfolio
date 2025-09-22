package com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos;

import lombok.Data;

@Data
public class AddAsset {
    private String ticker;
    private Double quantity;
}

