package com.cabinet.ophtalmologie.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatistiquesDTO {

    // Totaux généraux
    private long totalPatients;
    private long totalRdv;
    private long totalAnalyses;
    private long rdvUrgents;
    private long rdvAnnules;
    private long rdvPrevus;
    private long rdvTermines;
    private long analysesEnAttente;
    private long analysesExaminees;
    private double tauxAnnulation;
    private double tauxUrgence;

    // RDV par jour (7 derniers jours) — label -> count
    private List<JourStat> rdvParJour;

    // Répartition par statut
    private Map<String, Long> rdvParStatut;

    // Répartition analyses par type
    private Map<String, Long> analysesParType;

    // Nouveaux patients par semaine (4 dernières semaines)
    private List<SemaineStat> nouveauxPatientsParSemaine;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JourStat {
        private String label; // "Lun", "Mar", etc.
        private String date;  // "2026-04-01"
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SemaineStat {
        private String label; // "S1", "S2", etc.
        private long count;
    }
}