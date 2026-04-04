package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByCin(String cin);
    Optional<Patient> findByTelephone(String telephone);
    Optional<Patient> findByUtilisateurId(Long utilisateurId);

    @Query("SELECT p FROM Patient p WHERE " +
            "LOWER(p.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "p.telephone LIKE CONCAT('%', :query, '%') OR " +
            "p.cin LIKE CONCAT('%', :query, '%')")
    Page<Patient> searchPatients(@Param("query") String query, Pageable pageable);

    boolean existsByCin(String cin);
    boolean existsByTelephone(String telephone);
}