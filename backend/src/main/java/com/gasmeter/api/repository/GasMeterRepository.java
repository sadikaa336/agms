package com.gasmeter.api.repository;

import com.gasmeter.api.model.GasMeter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface GasMeterRepository extends JpaRepository<GasMeter, Long> {
    Optional<GasMeter> findByMeterNumber(String meterNumber);
    Optional<GasMeter> findBySerialNumber(String serialNumber);
    Optional<GasMeter> findByCommunicationId(String communicationId);
    List<GasMeter> findByCustomerId(Long customerId);
}
