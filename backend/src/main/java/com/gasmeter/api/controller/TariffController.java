package com.gasmeter.api.controller;

import com.gasmeter.api.model.Tariff;
import com.gasmeter.api.service.TariffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tariffs")
@CrossOrigin(origins = "*")
public class TariffController {

    @Autowired
    private TariffService tariffService;

    @GetMapping
    public ResponseEntity<List<Tariff>> getAllTariffs() {
        return ResponseEntity.ok(tariffService.getAllTariffs());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Tariff>> getActiveTariffs() {
        return ResponseEntity.ok(tariffService.getActiveTariffs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tariff> getTariffById(@PathVariable Long id) {
        return tariffService.getTariffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTariff(@RequestBody Tariff tariff) {
        try {
            Tariff created = tariffService.createTariff(tariff);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTariff(@PathVariable Long id, @RequestBody Tariff tariff) {
        try {
            Tariff updated = tariffService.updateTariff(id, tariff);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTariff(@PathVariable Long id) {
        try {
            tariffService.deleteTariff(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
