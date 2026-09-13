package com.gasmeter.api.repository;

import com.gasmeter.api.model.Recharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RechargeRepository extends JpaRepository<Recharge, Long> {
    Optional<Recharge> findByToken(String token);
    List<Recharge> findByMeterId(Long meterId);
}
