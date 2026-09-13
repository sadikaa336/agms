package com.gasmeter.api.service;

import com.gasmeter.api.model.Consumption;
import com.gasmeter.api.model.GasMeter;
import com.gasmeter.api.model.Recharge;
import com.gasmeter.api.repository.ConsumptionRepository;
import com.gasmeter.api.repository.GasMeterRepository;
import com.gasmeter.api.repository.RechargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class RechargeService {

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private GasMeterRepository meterRepository;

    @Autowired
    private ConsumptionRepository consumptionRepository;

    public List<Recharge> getAllRecharges() {
        return rechargeRepository.findAll();
    }

    public List<Recharge> getRechargesByMeterId(Long meterId) {
        return rechargeRepository.findByMeterId(meterId);
    }

    @Transactional
    public Recharge createRecharge(Long meterId, BigDecimal amount, String paymentMethod) {
        GasMeter meter = meterRepository.findById(meterId)
                .orElseThrow(() -> new IllegalArgumentException("Meter not found with ID: " + meterId));

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Recharge amount must be greater than zero");
        }

        // Generate 20-digit STS/DLMS standard style numeric token (formatted in groups of 4: XXXX-XXXX-XXXX-XXXX-XXXX)
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

        // Update meter's remaining balance on today's consumption record
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

        return saved;
    }
}
