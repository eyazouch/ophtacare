package com.cabinet.ophtalmologie.dto;

import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousDTO {

    private Long id;
    private Long patientId;
    private String patientNomComplet;
    private LocalDateTime dateHeure;
    private LocalDateTime dateHeureAlt;
    private Integer dureeMinutes;
    private String motif;
    private Boolean urgent;
    private StatutRendezVous statut;
    private String notesMedecin;
    private Long creeParId;
    private String creeParUsername;
    private LocalDateTime dateCreation;
}