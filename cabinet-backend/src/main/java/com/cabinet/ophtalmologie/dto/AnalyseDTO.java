package com.cabinet.ophtalmologie.dto;

import com.cabinet.ophtalmologie.model.enums.StatutAnalyse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyseDTO {

    private Long id;
    private Long patientId;
    private String patientNomComplet;
    private String typeAnalyse;
    private String fichierPath;
    private String fichierNom;
    private LocalDateTime dateDepot;
    private String commentaireMedecin;
    private Boolean urgent;
    private StatutAnalyse statut;
    private LocalDateTime dateExamen;
}
