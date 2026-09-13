package com.gasmeter.api.repository;

import com.gasmeter.api.model.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    List<Consumption> findByMeterId(Long meterId);
    Optional<Consumption> findByMeterIdAndRecordedDate(Long meterId, LocalDate recordedDate);
}
