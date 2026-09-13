package com.gasmeter.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recharges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meter_id", nullable = false)
    private GasMeter meter;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, unique = true, length = 100)
    private String token;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CREDIT_CARD, MOBILE_BANKING, WALLET

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, SUCCESSFUL, FAILED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
