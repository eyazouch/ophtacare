package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.StatutAnalyse;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analyse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;

    @NotBlank(message = "Le type d'analyse est obligatoire")
    @Column(name = "type_analyse", nullable = false, length = 100)
    private String typeAnalyse;

    @NotBlank
    @Column(name = "fichier_path", nullable = false, length = 500)
    private String fichierPath;

    @NotBlank
    @Column(name = "fichier_nom", nullable = false, length = 255)
    private String fichierNom;

    @Column(name = "date_depot", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateDepot = LocalDateTime.now();

    @Column(name = "commentaire_medecin", columnDefinition = "TEXT")
    private String commentaireMedecin;

    @Column(nullable = false)
    @Builder.Default
    private Boolean urgent = false;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutAnalyse statut = StatutAnalyse.EN_ATTENTE;

    @Column(name = "date_examen")
    private LocalDateTime dateExamen;
}
