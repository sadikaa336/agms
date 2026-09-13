package com.gasmeter.api.controller;

import com.gasmeter.api.model.Consumption;
import com.gasmeter.api.model.GasMeter;
import com.gasmeter.api.model.Recharge;
import com.gasmeter.api.service.MeterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meters")
@CrossOrigin(origins = "*")
public class MeterController {

    @Autowired
    private MeterService meterService;

    @GetMapping
    public ResponseEntity<List<GasMeter>> getAllMeters() {
        return ResponseEntity.ok(meterService.getAllMeters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GasMeter> getMeterById(@PathVariable Long id) {
        return meterService.getMeterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMeter(@RequestBody GasMeter meter, @RequestParam(required = false) Long customerId) {
        try {
            GasMeter created = meterService.createMeter(meter, customerId);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeter(@PathVariable Long id, @RequestBody GasMeter meter, @RequestParam(required = false) Long customerId) {
        try {
            GasMeter updated = meterService.updateMeter(id, meter, customerId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/valve")
    public ResponseEntity<?> toggleValve(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.getOrDefault("valveStatus", "OPEN");
            GasMeter updated = meterService.toggleValve(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeter(@PathVariable Long id) {
        try {
            meterService.deleteMeter(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/recharge")
    public ResponseEntity<?> recharge(
            @PathVariable Long id,
            @RequestParam(required = false) BigDecimal amount,
            @RequestParam(required = false) String paymentMethod,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            BigDecimal amt = amount;
            String method = paymentMethod;

            if (body != null) {
                if (body.containsKey("amount")) {
                    amt = new BigDecimal(body.get("amount").toString());
                }
                if (body.containsKey("paymentMethod")) {
                    method = body.get("paymentMethod").toString();
                }
            }

            if (amt == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount is required"));
            }

            Recharge recharge = meterService.processRecharge(id, amt, method);
            return ResponseEntity.ok(recharge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/telemetry")
    public ResponseEntity<Consumption> submitTelemetry(
            @RequestParam String communicationId,
            @RequestParam BigDecimal usage,
            @RequestParam BigDecimal reading,
            @RequestParam BigDecimal balance,
            @RequestParam(required = false) BigDecimal pressure,
            @RequestParam(required = false) BigDecimal temperature) {
        try {
            Consumption consumption = meterService.updateTelemetry(
                    communicationId, usage, reading, balance, pressure, temperature);
            return ResponseEntity.ok(consumption);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
