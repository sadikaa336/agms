package com.gasmeter.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumption", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"meter_id", "recorded_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consumption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meter_id", nullable = false)
    private GasMeter meter;

    @Column(name = "daily_usage", nullable = false, precision = 10, scale = 3)
    private BigDecimal dailyUsage; // m3

    @Column(name = "remaining_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingBalance;

    @Column(name = "meter_reading", nullable = false, precision = 12, scale = 3)
    private BigDecimal meterReading;

    @Column(precision = 8, scale = 2)
    private BigDecimal pressure;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
