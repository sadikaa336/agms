package com.gasmeter.api.service;

import com.gasmeter.api.model.AuditLog;
import com.gasmeter.api.model.CommunicationLog;
import com.gasmeter.api.model.GasMeter;
import com.gasmeter.api.repository.AuditLogRepository;
import com.gasmeter.api.repository.CommunicationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private CommunicationLogRepository communicationLogRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<CommunicationLog> getCommunicationLogs() {
        return communicationLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    @Transactional
    public CommunicationLog logCommunication(GasMeter meter, String direction, String packetData, String status, Integer retries, String errorMessage) {
        CommunicationLog log = new CommunicationLog();
        log.setMeter(meter);
        log.setDirection(direction);
        log.setPacketData(packetData);
        log.setStatus(status != null ? status : "SUCCESS");
        log.setRetryCount(retries != null ? retries : 0);
        log.setErrorMessage(errorMessage);
        log.setCreatedAt(LocalDateTime.now());
        return communicationLogRepository.save(log);
    }

    @Transactional
    public AuditLog logAudit(String action, String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setCreatedAt(LocalDateTime.now());
        return auditLogRepository.save(log);
    }
}
