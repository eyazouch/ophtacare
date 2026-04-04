package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.Analyse;
import com.cabinet.ophtalmologie.model.enums.StatutAnalyse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyseRepository extends JpaRepository<Analyse, Long> {

    List<Analyse> findByPatientIdOrderByDateDepotDesc(Long patientId);

    List<Analyse> findByStatut(StatutAnalyse statut);

    List<Analyse> findByStatutOrderByDateDepotAsc(StatutAnalyse statut);

    long countByStatut(StatutAnalyse statut);

    long countByPatientId(Long patientId);
}
