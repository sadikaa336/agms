package com.gasmeter.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "gas_meters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GasMeter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meter_number", nullable = false, unique = true, length = 50)
    private String meterNumber;

    @Column(name = "serial_number", nullable = false, unique = true, length = 50)
    private String serialNumber;

    @Column(name = "communication_id", nullable = false, unique = true, length = 50)
    private String communicationId;

    @Column(name = "firmware_version", length = 20)
    private String firmwareVersion;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, REPLACED

    @Column(name = "valve_status", nullable = false, length = 20)
    private String valveStatus = "CLOSED"; // OPEN, CLOSED

    @Column(name = "installation_location", columnDefinition = "TEXT")
    private String installationLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
