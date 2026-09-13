package com.gasmeter.api.repository;

import com.gasmeter.api.model.CommunicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {
    List<CommunicationLog> findByMeterIdOrderByCreatedAtDesc(Long meterId);
    List<CommunicationLog> findTop100ByOrderByCreatedAtDesc();
}
