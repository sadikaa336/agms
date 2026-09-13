package com.gasmeter.api.controller;

import com.gasmeter.api.model.AuditLog;
import com.gasmeter.api.model.CommunicationLog;
import com.gasmeter.api.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    @Autowired
    private LogService logService;

    @GetMapping("/communication")
    public ResponseEntity<List<CommunicationLog>> getCommunicationLogs() {
        return ResponseEntity.ok(logService.getCommunicationLogs());
    }

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(logService.getAuditLogs());
    }
}
