package com.finantial_portfolio_tracker.financial_portfolio_tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlphaVantageService implements StockDataService {

    private final WebClient webClient;

    @Value("${alpha.api-key}")
    private String apiKey;

    public AlphaVantageService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://www.alphavantage.co").build();
    }

    @Override
    @Cacheable(value = "prices", key = "#ticker")
    public BigDecimal getCurrentPrice(String ticker) {
        Map<String, Object> resp = callApi("GLOBAL_QUOTE", ticker);

        if (resp == null) return BigDecimal.ZERO;

        Map<?, ?> quote = (Map<?, ?>) resp.getOrDefault("Global Quote", Collections.emptyMap());
        Object price = quote.get("05. price");

        return price != null ? new BigDecimal(price.toString()) : BigDecimal.ZERO;
    }

    @Override
    @Cacheable(value = "historical", key = "#ticker + '_' + #days")
    public Map<LocalDate, BigDecimal> getHistoricalPrices(String ticker, int days) {
        String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + ticker +
                "?range=" + days + "d&interval=1d";

        Map<String, Object> resp = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorReturn(Collections.emptyMap())
                .block();

        if (resp == null || resp.isEmpty()) return Collections.emptyMap();

        try {
            Map<String, Object> chart = (Map<String, Object>) resp.get("chart");
            List<Map<String, Object>> resultList = (List<Map<String, Object>>) chart.get("result");
            if (resultList == null || resultList.isEmpty()) return Collections.emptyMap();

            Map<String, Object> result = resultList.get(0);
            List<Integer> timestamps = (List<Integer>) result.get("timestamp");

            Map<String, Object> indicators = (Map<String, Object>) result.get("indicators");
            List<Map<String, List<Double>>> quoteList = (List<Map<String, List<Double>>>) indicators.get("quote");
            List<Double> closes = quoteList.get(0).get("close");

            Map<LocalDate, BigDecimal> historicalPrices = new LinkedHashMap<>();
            for (int i = 0; i < timestamps.size(); i++) {
                LocalDate date = Instant.ofEpochSecond(timestamps.get(i)).atZone(ZoneId.systemDefault()).toLocalDate();
                Double close = closes.get(i);
                if (close != null) {
                    historicalPrices.put(date, BigDecimal.valueOf(close));
                }
            }

            return historicalPrices;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }



    @Cacheable(value = "historical", key = "#ticker + '_' + #days")
    public Map<LocalDate, BigDecimal> getHistoricalPricesAlpha(String ticker, int days) {
        Map<String, Object> resp = callApi("TIME_SERIES_DAILY_ADJUSTED", ticker);

        if (resp == null) return Collections.emptyMap();

        Map<String, Map<String, String>> ts = (Map<String, Map<String, String>>)
                resp.getOrDefault("Time Series (Daily)", Collections.emptyMap());

        return ts.keySet().stream()
                .map(LocalDate::parse)
                .sorted(Comparator.reverseOrder())
                .limit(days)
                .collect(Collectors.toMap(
                        d -> d,
                        d -> new BigDecimal(ts.get(d.toString()).get("4. close")),
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    private Map<String, Object> callApi(String function, String ticker) {
        if (apiKey == null || apiKey.isBlank()) return null;

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/query")
                        .queryParam("function", function)
                        .queryParam("symbol", ticker)
                        .queryParam("outputsize", "compact")
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorReturn(Collections.emptyMap())
                .block();
    }
}
