package com.cabinet.ophtalmologie.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rdv")
    private RendezVous rendezVous;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_patient")
    private Patient patient;

    @NotBlank(message = "Le diagnostic est obligatoire")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnostic;

    @Column(columnDefinition = "TEXT")
    private String traitement;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "date_consultation", nullable = false)
    @Builder.Default
    private LocalDateTime dateConsultation = LocalDateTime.now();
}
