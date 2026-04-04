package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rendez_vous")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;

    @NotNull(message = "La date et heure du RDV sont obligatoires")
    @Column(name = "date_heure", nullable = false)
    private LocalDateTime dateHeure;

    @Column(name = "date_heure_alt")
    private LocalDateTime dateHeureAlt;

    @Column(name = "duree_minutes")
    @Builder.Default
    private Integer dureeMinutes = 30;

    @Column(length = 255)
    private String motif;

    @Column(nullable = false)
    @Builder.Default
    private Boolean urgent = false;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatutRendezVous statut = StatutRendezVous.EN_ATTENTE_APPROBATION;

    @Column(name = "notes_medecin", columnDefinition = "TEXT")
    private String notesMedecin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cree_par")
    private Utilisateur creePar;

    @Column(name = "date_creation", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToOne(mappedBy = "rendezVous", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Consultation consultation;
}