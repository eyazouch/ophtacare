package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByPatientIdOrderByDateConsultationDesc(Long patientId);

    Optional<Consultation> findByRendezVousId(Long rendezVousId);
}
