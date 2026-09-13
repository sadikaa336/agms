package com.gasmeter.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "communication_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meter_id")
    private GasMeter meter;

    @Column(nullable = false, length = 10)
    private String direction; // INCOMING, OUTGOING

    @Column(name = "packet_data", nullable = false, columnDefinition = "TEXT")
    private String packetData;

    @Column(nullable = false, length = 20)
    private String status; // SUCCESS, ERROR, RETRY

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
