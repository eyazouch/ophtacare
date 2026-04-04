package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.RendezVous;
import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    List<RendezVous> findByPatientIdOrderByDateHeureDesc(Long patientId);
    List<RendezVous> findByStatut(StatutRendezVous statut);
    List<RendezVous> findByUrgentTrueAndStatut(StatutRendezVous statut);

    @Query("SELECT r FROM RendezVous r WHERE r.statut NOT IN ('ANNULE', 'EN_ATTENTE_APPROBATION') " +
            "AND r.dateHeure < :fin AND :debut < FUNCTION('TIMESTAMPADD', MINUTE, r.dureeMinutes, r.dateHeure)")
    List<RendezVous> findConflits(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT r FROM RendezVous r WHERE r.dateHeure >= :debut AND r.dateHeure < :fin " +
            "AND r.statut NOT IN ('ANNULE', 'EN_ATTENTE_APPROBATION') ORDER BY r.dateHeure ASC")
    List<RendezVous> findByJournee(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    long countByStatut(StatutRendezVous statut);
    long countByUrgentTrue();

    @Query("SELECT COUNT(r) FROM RendezVous r WHERE r.dateHeure >= :debut AND r.dateHeure < :fin")
    long countByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    // Stats par jour pour les 7 derniers jours
    @Query("SELECT r FROM RendezVous r WHERE r.dateHeure >= :debut AND r.statut <> 'ANNULE' ORDER BY r.dateHeure ASC")
    List<RendezVous> findFromDate(@Param("debut") LocalDateTime debut);

    // Patients distincts avec RDV (pour stats)
    @Query("SELECT COUNT(DISTINCT r.patient.id) FROM RendezVous r WHERE r.dateHeure >= :debut")
    long countDistinctPatientsSince(@Param("debut") LocalDateTime debut);
}