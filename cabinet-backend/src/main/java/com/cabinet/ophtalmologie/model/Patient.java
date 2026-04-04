package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.Sexe;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false, length = 50)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(nullable = false, length = 50)
    private String prenom;

    @Column(unique = true, length = 20)
    private String cin;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Column(unique = true, nullable = false, length = 20)
    private String telephone;

    @NotNull(message = "La date de naissance est obligatoire")
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    @Column(name = "groupe_sanguin", length = 5)
    private String groupeSanguin;

    // ===== RELATIONS =====

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RendezVous> rendezVous = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Analyse> analyses = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Consultation> consultations = new ArrayList<>();

    // ===== MÉTHODES UTILITAIRES =====

    public String getNomComplet() {
        return prenom + " " + nom;
    }
}
