package com.gasmeter.api.repository;

import com.gasmeter.api.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, Long> {
    Optional<Tariff> findByName(String name);
    List<Tariff> findByIsActiveTrue();
}
