package com.gasmeter.api.service;

import com.gasmeter.api.model.*;
import com.gasmeter.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private GasMeterRepository meterRepository;

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private ConsumptionRepository consumptionRepository;

    @Autowired
    private CommunicationLogRepository communicationLogRepository;

    public Map<String, Object> getDashboardStats() {
        long totalCustomers = customerRepository.count();
        List<GasMeter> meters = meterRepository.findAll();
        long totalMeters = meters.size();

        long activeMeters = meters.stream()
                .filter(m -> "ACTIVE".equalsIgnoreCase(m.getStatus()))
                .count();
        long offlineMeters = totalMeters - activeMeters;

        long alarms = meters.stream()
                .filter(m -> "CLOSED".equalsIgnoreCase(m.getValveStatus()) || "INACTIVE".equalsIgnoreCase(m.getStatus()))
                .count();

        LocalDate today = LocalDate.now();
        List<Consumption> todayConsumptions = consumptionRepository.findAll().stream()
                .filter(c -> today.equals(c.getRecordedDate()))
                .toList();

        BigDecimal todayConsumption = todayConsumptions.stream()
                .map(Consumption::getDailyUsage)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Recharge> allRecharges = rechargeRepository.findAll();

        LocalDateTime startOfToday = today.atStartOfDay();
        BigDecimal todayRecharge = allRecharges.stream()
                .filter(r -> r.getCreatedAt() != null && !r.getCreatedAt().isBefore(startOfToday))
                .map(Recharge::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        BigDecimal revenue = allRecharges.stream()
                .filter(r -> r.getCreatedAt() != null && !r.getCreatedAt().isBefore(startOfMonth))
                .map(Recharge::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalMeters", totalMeters);
        stats.put("activeMeters", activeMeters);
        stats.put("offlineMeters", offlineMeters);
        stats.put("alarms", alarms);
        stats.put("todayConsumption", todayConsumption);
        stats.put("totalRecharge", todayRecharge);
        stats.put("revenue", revenue);

        // Meter status breakdown
        List<Map<String, Object>> meterStatusSeries = new ArrayList<>();
        meterStatusSeries.add(Map.of("name", "Online", "value", activeMeters));
        meterStatusSeries.add(Map.of("name", "Idle/Warning", "value", alarms));
        meterStatusSeries.add(Map.of("name", "Offline", "value", offlineMeters));
        stats.put("meterStatusSeries", meterStatusSeries);

        // Consumption series for past 7 days
        List<Map<String, Object>> series = new ArrayList<>();
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("EEE");
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            BigDecimal dayUsage = consumptionRepository.findAll().stream()
                    .filter(c -> d.equals(c.getRecordedDate()))
                    .map(Consumption::getDailyUsage)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal dayRev = allRecharges.stream()
                    .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().toLocalDate().equals(d))
                    .map(Recharge::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            series.add(Map.of(
                    "d", d.format(dayFmt),
                    "usage", dayUsage,
                    "revenue", dayRev
            ));
        }
        stats.put("consumptionSeries", series);

        // Recent activity
        List<Map<String, Object>> recentActivity = new ArrayList<>();
        allRecharges.stream()
                .sorted(Comparator.comparing(Recharge::getCreatedAt).reversed())
                .limit(5)
                .forEach(r -> {
                    recentActivity.add(Map.of(
                            "id", "r-" + r.getId(),
                            "type", "Recharge",
                            "detail", "Token generated: $" + r.getAmount() + " (" + (r.getMeter() != null ? r.getMeter().getMeterNumber() : "Meter") + ")",
                            "status", "success",
                            "when", r.getCreatedAt() != null ? r.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm")) : "Just now"
                    ));
                });

        communicationLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .limit(5)
                .forEach(l -> {
                    recentActivity.add(Map.of(
                            "id", "l-" + l.getId(),
                            "type", "Telemetry",
                            "detail", "DLMS Packet " + l.getDirection() + " - " + l.getStatus(),
                            "status", "SUCCESS".equalsIgnoreCase(l.getStatus()) ? "info" : "error",
                            "when", l.getCreatedAt() != null ? l.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm")) : "Just now"
                    ));
                });

        stats.put("recentActivity", recentActivity);

        return stats;
    }
}
