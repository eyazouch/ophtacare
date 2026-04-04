package com.cabinet.ophtalmologie.repository;

import com.cabinet.ophtalmologie.model.Utilisateur;
import com.cabinet.ophtalmologie.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByUsername(String username);

    Optional<Utilisateur> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    long countByRole(Role role);
}
