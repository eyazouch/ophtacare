package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.CreneauDisponible;
import com.cabinet.ophtalmologie.model.enums.JourSemaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreneauDisponibleRepository extends JpaRepository<CreneauDisponible, Long> {

    List<CreneauDisponible> findByJourSemaineAndActifTrue(JourSemaine jourSemaine);

    List<CreneauDisponible> findByJourSemaineAndActifTrueOrderByHeureDebutAsc(JourSemaine jourSemaine);

    List<CreneauDisponible> findByActifTrue();
}
