package com.finantial_portfolio_tracker.financial_portfolio_tracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "portfolios")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Portfolio {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID id;

    private String name;

    @ManyToOne(optional = false)
    private User owner;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Asset> assets;

    private Instant createdAt = Instant.now();

    @Override
    public String toString() {
        return "Portfolio{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", assetsCount=" + (assets != null ? assets.size() : 0) +
                '}';
    }
}
