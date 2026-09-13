package com.gasmeter.api.controller;

import com.gasmeter.api.model.Recharge;
import com.gasmeter.api.service.RechargeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recharges")
@CrossOrigin(origins = "*")
public class RechargeController {

    @Autowired
    private RechargeService rechargeService;

    @GetMapping
    public ResponseEntity<List<Recharge>> getAllRecharges() {
        return ResponseEntity.ok(rechargeService.getAllRecharges());
    }

    @GetMapping("/meter/{meterId}")
    public ResponseEntity<List<Recharge>> getRechargesByMeter(@PathVariable Long meterId) {
        return ResponseEntity.ok(rechargeService.getRechargesByMeterId(meterId));
    }

    @PostMapping
    public ResponseEntity<?> createRecharge(@RequestBody Map<String, Object> payload) {
        try {
            Long meterId = Long.valueOf(payload.get("meterId").toString());
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            String paymentMethod = payload.getOrDefault("paymentMethod", "MOBILE_BANKING").toString();

            Recharge created = rechargeService.createRecharge(meterId, amount, paymentMethod);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
