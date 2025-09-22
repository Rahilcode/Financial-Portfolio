package com.finantial_portfolio_tracker.financial_portfolio_tracker.service;

import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.AddAsset;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.AssetDto;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.InsightDto;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.dtos.PortfolioDto;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.Asset;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.Portfolio;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.model.User;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.repository.AssetRepository;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.repository.PortfolioRepository;
import com.finantial_portfolio_tracker.financial_portfolio_tracker.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PortfolioService {

    private @NonNull final PortfolioRepository portfolioRepo;
    private @NonNull final UserRepository userRepo;
    private @NonNull final AssetRepository assetRepo;
    private @NonNull final StockDataService dataService;


    public PortfolioDto createPortfolio(String username, String name) throws UsernameNotFoundException {
        User owner = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        Portfolio p = Portfolio.builder().name(name).owner(owner).build();
        p = portfolioRepo.save(p);
        return mapToDto(p);
    }

    public PortfolioDto getPortfolio(UUID portfolioId, String username) {
        Portfolio p = portfolioRepo.findById(portfolioId).orElseThrow();
        System.out.println("Reaching here " + p);
        if (!p.getOwner().getUsername().equals(username)) throw new RuntimeException("Not allowed");
        return buildWithMarketPrices(p);
    }

    public AssetDto addAsset(UUID portfolioId, AddAsset req, String username) {
        Portfolio p = portfolioRepo.findById(portfolioId).orElseThrow();
        if (!p.getOwner().getUsername().equals(username)) throw new RuntimeException("Not allowed");

        String ticker = req.getTicker().toUpperCase(Locale.ROOT);
        double q = req.getQuantity() != null ? req.getQuantity() : 0.0;

        Optional<Asset> opt = assetRepo.findByPortfolioIdAndTickerIgnoreCase(portfolioId, ticker);
        Asset asset;
        if (opt.isPresent()) {
            asset = opt.get();
            asset.setQuantity(asset.getQuantity() + q);
        } else {
            asset = Asset.builder().ticker(ticker).quantity(q).portfolio(p).build();
            p.getAssets().add(asset);
        }
        asset = assetRepo.save(asset);
        return mapToAssetDto(asset);
    }

    public void removeAsset(UUID portfolioId, UUID assetId, String username) {
        Portfolio p = portfolioRepo.findById(portfolioId).orElseThrow();
        if (!p.getOwner().getUsername().equals(username)) throw new RuntimeException("Not allowed");
        Asset a = assetRepo.findById(assetId).orElseThrow();
        if (!a.getPortfolio().getId().equals(portfolioId)) throw new RuntimeException("Mismatch");
        assetRepo.delete(a);
    }

    public Map<LocalDate, BigDecimal> getHistoricalForTicker(String ticker, int days) {
        return dataService.getHistoricalPrices(ticker, days);
    }

    // use ai llm for this logic
    public InsightDto getInsights(UUID portfolioId, String username) {
        PortfolioDto dto = getPortfolio(portfolioId, username);
        if (dto.getTotalValue() == null || dto.getTotalValue().compareTo(BigDecimal.ZERO) == 0) {
            return new InsightDto(0, new InsightDto.LargestPosition("NONE",0.0), "Add assets to get insights");
        }

        List<AssetDto> assets = dto.getAssets();
        BigDecimal total = dto.getTotalValue();
        double maxWeight = 0;
        String maxTicker = "";
        for (AssetDto a : assets) {
            double w = a.getTotalValue() == null ? 0.0 : a.getTotalValue().divide(total, 8, BigDecimal.ROUND_HALF_UP).doubleValue();
            if (w > maxWeight) { maxWeight = w; maxTicker = a.getTicker(); }
        }

        double score;
        if (maxWeight <= 0.2) score = 100;
        else {
            score = Math.max(0, 100 * (1 - (maxWeight - 0.2) / 0.8));
        }
        int finalScore = (int)Math.round(score);

        String recommendation = "Consider adding broad-market ETFs like VTI or SPY to reduce single-stock concentration.";

        return new InsightDto(finalScore, new InsightDto.LargestPosition(maxTicker, maxWeight), recommendation);
    }

    public List<PortfolioDto> getUserPortfolios(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        List<Portfolio> portfolios = portfolioRepo.findByOwner(user);

        // If no portfolios exist, auto-create a default one
        if (portfolios.isEmpty()) {
            Portfolio defaultPortfolio = Portfolio.builder()
                    .name("My Portfolio")
                    .owner(user)
                    .assets(new ArrayList<>())
                    .build();
            defaultPortfolio = portfolioRepo.save(defaultPortfolio);
            portfolios.add(defaultPortfolio);
        }

        return portfolios.stream()
                .map(this::buildWithMarketPrices)
                .collect(Collectors.toList());
    }


    private PortfolioDto buildWithMarketPrices(Portfolio p) {
        List<AssetDto> assets = p.getAssets().stream().map(asset -> {
            BigDecimal price = dataService.getCurrentPrice(asset.getTicker());
            BigDecimal total = price.multiply(BigDecimal.valueOf(asset.getQuantity()));
            return new AssetDto(asset.getId(), asset.getTicker(), asset.getQuantity(), asset.getAvgPrice(), price, total);
        }).collect(Collectors.toList());

        BigDecimal portfolioTotal = assets.stream()
                .map(AssetDto::getTotalValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PortfolioDto(p.getId(), p.getName(), assets, portfolioTotal);
    }

    private PortfolioDto mapToDto(Portfolio p) {
        return new PortfolioDto(p.getId(), p.getName(), Collections.emptyList(), BigDecimal.ZERO);
    }

    private AssetDto mapToAssetDto(Asset asset) {
        BigDecimal price = dataService.getCurrentPrice(asset.getTicker());
        BigDecimal total = price.multiply(BigDecimal.valueOf(asset.getQuantity()));
        return new AssetDto(asset.getId(), asset.getTicker(), asset.getQuantity(), asset.getAvgPrice(), price, total);
    }
}


