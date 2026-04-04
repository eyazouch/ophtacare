package com.cabinet.ophtalmologie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    // Statistiques globales
    private long totalPatients;
    private long totalRdv;
    private long rdvDuJour;
    private long rdvEnAttente;
    private long rdvUrgents;
    private long analysesEnAttente;
    private long totalAnalyses;
    private long rdvAnnules;
    private double tauxAnnulation;

    // Listes pour le planning
    private List<RendezVousDTO> planningDuJour;
    private List<RendezVousDTO> urgences;
    private List<AnalyseDTO> analysesAExaminer;
}
