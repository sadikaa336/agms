package com.gasmeter.api.service;

import com.gasmeter.api.model.Tariff;
import com.gasmeter.api.repository.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TariffService {

    @Autowired
    private TariffRepository tariffRepository;

    public List<Tariff> getAllTariffs() {
        return tariffRepository.findAll();
    }

    public List<Tariff> getActiveTariffs() {
        return tariffRepository.findByIsActiveTrue();
    }

    public Optional<Tariff> getTariffById(Long id) {
        return tariffRepository.findById(id);
    }

    @Transactional
    public Tariff createTariff(Tariff tariff) {
        tariff.setCreatedAt(LocalDateTime.now());
        tariff.setUpdatedAt(LocalDateTime.now());
        return tariffRepository.save(tariff);
    }

    @Transactional
    public Tariff updateTariff(Long id, Tariff updated) {
        Tariff existing = tariffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tariff not found with ID: " + id));

        existing.setName(updated.getName());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setVatPercentage(updated.getVatPercentage());
        existing.setFixedCharge(updated.getFixedCharge());
        existing.setServiceCharge(updated.getServiceCharge());
        existing.setIsActive(updated.getIsActive());
        existing.setUpdatedAt(LocalDateTime.now());

        return tariffRepository.save(existing);
    }

    @Transactional
    public void deleteTariff(Long id) {
        tariffRepository.deleteById(id);
    }
}
