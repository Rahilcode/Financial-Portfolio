package com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsightDto {
    private int diversificationScore;
    private LargestPosition largestPosition;
    private String recommended;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LargestPosition {
        private String ticker;
        private double weight;
    }
}
