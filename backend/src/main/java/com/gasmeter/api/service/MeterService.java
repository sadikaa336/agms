package com.gasmeter.api.service;

import com.gasmeter.api.model.*;
import com.gasmeter.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MeterService {

    @Autowired
    private GasMeterRepository meterRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private ConsumptionRepository consumptionRepository;

    public List<GasMeter> getAllMeters() {
        return meterRepository.findAll();
    }

    public Optional<GasMeter> getMeterById(Long id) {
        return meterRepository.findById(id);
    }

    public Optional<GasMeter> getMeterByCommunicationId(String commId) {
        return meterRepository.findByCommunicationId(commId);
    }

    @Transactional
    public GasMeter createMeter(GasMeter meter, Long customerId) {
        if (meterRepository.findByMeterNumber(meter.getMeterNumber()).isPresent()) {
            throw new IllegalArgumentException("Meter Number already exists: " + meter.getMeterNumber());
        }
        if (meterRepository.findBySerialNumber(meter.getSerialNumber()).isPresent()) {
            throw new IllegalArgumentException("Serial Number already exists: " + meter.getSerialNumber());
        }
        if (meterRepository.findByCommunicationId(meter.getCommunicationId()).isPresent()) {
            throw new IllegalArgumentException("Communication ID already exists: " + meter.getCommunicationId());
        }

        if (customerId != null) {
            Customer customer = customerRepository.findById(customerId).orElse(null);
            meter.setCustomer(customer);
        }

        if (meter.getStatus() == null || meter.getStatus().isBlank()) {
            meter.setStatus("ACTIVE");
        }
        if (meter.getValveStatus() == null || meter.getValveStatus().isBlank()) {
            meter.setValveStatus("CLOSED"); // Default to CLOSED until recharged!
        }

        meter.setCreatedAt(LocalDateTime.now());
        meter.setUpdatedAt(LocalDateTime.now());
        GasMeter saved = meterRepository.save(meter);

        // Seed initial consumption record with 0 reading and 0 balance
        Consumption initial = new Consumption();
        initial.setMeter(saved);
        initial.setDailyUsage(BigDecimal.ZERO);
        initial.setMeterReading(BigDecimal.ZERO);
        initial.setRemainingBalance(BigDecimal.ZERO); // Initial credit balance: $0.00
        initial.setRecordedDate(LocalDate.now());
        initial.setCreatedAt(LocalDateTime.now());
        consumptionRepository.save(initial);

        return saved;
    }

    @Transactional
    public GasMeter updateMeter(Long id, GasMeter updated, Long customerId) {
        GasMeter existing = meterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with ID: " + id));

        existing.setMeterNumber(updated.getMeterNumber());
        existing.setSerialNumber(updated.getSerialNumber());
        existing.setCommunicationId(updated.getCommunicationId());
        existing.setFirmwareVersion(updated.getFirmwareVersion());
        existing.setInstallationLocation(updated.getInstallationLocation());
        existing.setStatus(updated.getStatus());
        existing.setValveStatus(updated.getValveStatus());
        existing.setUpdatedAt(LocalDateTime.now());

        if (customerId != null) {
            Customer customer = customerRepository.findById(customerId).orElse(null);
            existing.setCustomer(customer);
        } else if (customerId == null && updated.getCustomer() == null) {
            existing.setCustomer(null);
        }

        return meterRepository.save(existing);
    }

    @Transactional
    public GasMeter toggleValve(Long id, String valveStatus) {
        GasMeter meter = meterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with ID: " + id));

        String target = "CLOSED".equalsIgnoreCase(valveStatus) ? "CLOSED" : "OPEN";
        if ("OPEN".equals(target)) {
            LocalDate today = LocalDate.now();
            Consumption cons = consumptionRepository.findByMeterIdAndRecordedDate(meter.getId(), today).orElse(null);
            if (cons == null || cons.getRemainingBalance() == null || cons.getRemainingBalance().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Cannot open valve: Credit balance is $0.00. Please recharge the meter first.");
            }
        }
        meter.setValveStatus(target);
        meter.setUpdatedAt(LocalDateTime.now());
        return meterRepository.save(meter);
    }

    @Transactional
    public void deleteMeter(Long id) {
        meterRepository.deleteById(id);
    }

    @Transactional
    public Recharge processRecharge(Long meterId, BigDecimal amount, String paymentMethod) {
        GasMeter meter = meterRepository.findById(meterId)
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with ID: " + meterId));

        Random random = new Random();
        StringBuilder tokenBuilder = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            if (i > 0) tokenBuilder.append("-");
            tokenBuilder.append(String.format("%04d", random.nextInt(10000)));
        }
        String token = tokenBuilder.toString();

        Recharge recharge = new Recharge();
        recharge.setMeter(meter);
        recharge.setAmount(amount);
        recharge.setToken(token);
        recharge.setPaymentMethod(paymentMethod != null ? paymentMethod : "MOBILE_BANKING");
        recharge.setStatus("SUCCESSFUL");
        recharge.setCreatedAt(LocalDateTime.now());

        Recharge saved = rechargeRepository.save(recharge);

        LocalDate today = LocalDate.now();
        Consumption consumption = consumptionRepository.findByMeterIdAndRecordedDate(meter.getId(), today)
                .orElse(null);

        if (consumption != null) {
            consumption.setRemainingBalance(consumption.getRemainingBalance().add(amount));
            consumptionRepository.save(consumption);
        } else {
            Consumption newCons = new Consumption();
            newCons.setMeter(meter);
            newCons.setDailyUsage(BigDecimal.ZERO);
            newCons.setMeterReading(BigDecimal.ZERO);
            newCons.setRemainingBalance(amount);
            newCons.setRecordedDate(today);
            newCons.setCreatedAt(LocalDateTime.now());
            consumptionRepository.save(newCons);
        }

        // Automatically open valve once recharged!
        meter.setValveStatus("OPEN");
        meter.setUpdatedAt(LocalDateTime.now());
        meterRepository.save(meter);

        return saved;
    }

    @Transactional
    public Consumption updateTelemetry(String communicationId, BigDecimal usage, BigDecimal reading, BigDecimal balance, BigDecimal pressure, BigDecimal temp) {
        return updateTelemetry(communicationId, usage, reading, balance, pressure, temp, null);
    }

    @Transactional
    public Consumption updateTelemetry(String communicationId, BigDecimal usage, BigDecimal reading, BigDecimal balance, BigDecimal pressure, BigDecimal temp, String valveStatus) {
        GasMeter meter = meterRepository.findByCommunicationId(communicationId)
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with Communication ID: " + communicationId));

        LocalDate today = LocalDate.now();
        Consumption consumption = consumptionRepository.findByMeterIdAndRecordedDate(meter.getId(), today)
                .orElse(new Consumption());

        consumption.setMeter(meter);
        consumption.setDailyUsage(usage);
        consumption.setMeterReading(reading);
        consumption.setRemainingBalance(balance);
        consumption.setPressure(pressure);
        consumption.setTemperature(temp);
        consumption.setRecordedDate(today);

        // Handle valveStatus update or auto-close if balance exhausted
        if (valveStatus != null && !valveStatus.isBlank()) {
            meter.setValveStatus("OPEN".equalsIgnoreCase(valveStatus) ? "OPEN" : "CLOSED");
            meter.setUpdatedAt(LocalDateTime.now());
            meterRepository.save(meter);
        } else if (balance != null && balance.compareTo(BigDecimal.ZERO) <= 0) {
            meter.setValveStatus("CLOSED");
            meter.setUpdatedAt(LocalDateTime.now());
            meterRepository.save(meter);
        }

        return consumptionRepository.save(consumption);
    }

    public Consumption getLatestConsumption(Long meterId) {
        LocalDate today = LocalDate.now();
        return consumptionRepository.findByMeterIdAndRecordedDate(meterId, today)
                .orElse(null);
    }
}
