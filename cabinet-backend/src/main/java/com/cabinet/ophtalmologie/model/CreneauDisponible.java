package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.JourSemaine;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "creneaux_disponibles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreneauDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jour_semaine", nullable = false)
    private JourSemaine jourSemaine;

    @NotNull
    @Column(name = "heure_debut", nullable = false)
    private LocalTime heureDebut;

    @NotNull
    @Column(name = "heure_fin", nullable = false)
    private LocalTime heureFin;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;
}
