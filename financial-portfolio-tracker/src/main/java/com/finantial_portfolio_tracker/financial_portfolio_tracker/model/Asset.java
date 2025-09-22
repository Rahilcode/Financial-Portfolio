package com.finantial_portfolio_tracker.financial_portfolio_tracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID id;

    @Column(nullable=false)
    private String ticker;

    @Column(nullable=false)
    private Double quantity;

    private BigDecimal avgPrice;

    @ManyToOne(optional = false)
    private Portfolio portfolio;

    @Override
    public String toString() {
        return "Asset{" +
                "id=" + id +
                ", portfolioId=" + (portfolio != null ? portfolio.getId() : null) +
                '}';
    }
}