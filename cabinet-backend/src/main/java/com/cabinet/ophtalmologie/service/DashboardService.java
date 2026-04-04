package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.AnalyseDTO;
import com.cabinet.ophtalmologie.dto.DashboardDTO;
import com.cabinet.ophtalmologie.dto.RendezVousDTO;
import com.cabinet.ophtalmologie.dto.StatistiquesDTO;
import com.cabinet.ophtalmologie.model.Analyse;
import com.cabinet.ophtalmologie.model.RendezVous;
import com.cabinet.ophtalmologie.model.enums.StatutAnalyse;
import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import com.cabinet.ophtalmologie.repository.AnalyseRepository;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import com.cabinet.ophtalmologie.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final RendezVousRepository rdvRepository;
    private final AnalyseRepository analyseRepository;
    private final RendezVousService rendezVousService;
    private final AnalyseService analyseService;

    public DashboardDTO getStatistiques() {
        LocalDate today = LocalDate.now();
        LocalDateTime debutJournee = today.atStartOfDay();
        LocalDateTime finJournee = today.plusDays(1).atStartOfDay();

        long totalPatients = patientRepository.count();
        long totalRdv = rdvRepository.count();
        long rdvDuJour = rdvRepository.countByPeriode(debutJournee, finJournee);
        long rdvEnAttente = rdvRepository.countByStatut(StatutRendezVous.PREVU);
        long rdvUrgents = rdvRepository.countByUrgentTrue();
        long rdvAnnules = rdvRepository.countByStatut(StatutRendezVous.ANNULE);
        long analysesEnAttente = analyseRepository.countByStatut(StatutAnalyse.EN_ATTENTE);
        long totalAnalyses = analyseRepository.count();

        double tauxAnnulation = totalRdv > 0 ? Math.round((double) rdvAnnules / totalRdv * 10000.0) / 100.0 : 0;

        List<RendezVousDTO> planningDuJour = rendezVousService.getPlanningJournee(today);

        List<RendezVousDTO> urgences = rdvRepository
                .findByUrgentTrueAndStatut(StatutRendezVous.PREVU).stream()
                .map(rdv -> RendezVousDTO.builder()
                        .id(rdv.getId())
                        .patientId(rdv.getPatient().getId())
                        .patientNomComplet(rdv.getPatient().getNomComplet())
                        .dateHeure(rdv.getDateHeure())
                        .motif(rdv.getMotif())
                        .urgent(true)
                        .statut(rdv.getStatut())
                        .build())
                .collect(Collectors.toList());

        List<AnalyseDTO> analysesAExaminer = analyseService.getAnalysesEnAttente();

        return DashboardDTO.builder()
                .totalPatients(totalPatients)
                .totalRdv(totalRdv)
                .rdvDuJour(rdvDuJour)
                .rdvEnAttente(rdvEnAttente)
                .rdvUrgents(rdvUrgents)
                .analysesEnAttente(analysesEnAttente)
                .totalAnalyses(totalAnalyses)
                .rdvAnnules(rdvAnnules)
                .tauxAnnulation(tauxAnnulation)
                .planningDuJour(planningDuJour)
                .urgences(urgences)
                .analysesAExaminer(analysesAExaminer)
                .build();
    }

    public StatistiquesDTO getStatistiquesAvancees() {
        // Totaux
        long totalPatients = patientRepository.count();
        long totalRdv = rdvRepository.count();
        long totalAnalyses = analyseRepository.count();
        long rdvUrgents = rdvRepository.countByUrgentTrue();
        long rdvAnnules = rdvRepository.countByStatut(StatutRendezVous.ANNULE);
        long rdvPrevus = rdvRepository.countByStatut(StatutRendezVous.PREVU);
        long rdvTermines = rdvRepository.countByStatut(StatutRendezVous.TERMINE);
        long analysesEnAttente = analyseRepository.countByStatut(StatutAnalyse.EN_ATTENTE);
        long analysesExaminees = analyseRepository.countByStatut(StatutAnalyse.EXAMINEE);

        double tauxAnnulation = totalRdv > 0 ? Math.round((double) rdvAnnules / totalRdv * 10000.0) / 100.0 : 0;
        double tauxUrgence = totalRdv > 0 ? Math.round((double) rdvUrgents / totalRdv * 10000.0) / 100.0 : 0;

        // RDV par jour (7 derniers jours)
        List<StatistiquesDTO.JourStat> rdvParJour = new ArrayList<>();
        List<RendezVous> rdv7jours = rdvRepository.findFromDate(
                LocalDate.now().minusDays(6).atStartOfDay());

        for (int i = 6; i >= 0; i--) {
            LocalDate jour = LocalDate.now().minusDays(i);
            long count = rdv7jours.stream()
                    .filter(r -> r.getDateHeure().toLocalDate().equals(jour))
                    .count();
            String label = jour.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.FRENCH);
            rdvParJour.add(new StatistiquesDTO.JourStat(
                    label.substring(0, 1).toUpperCase() + label.substring(1),
                    jour.toString(),
                    count
            ));
        }

        // Répartition par statut
        Map<String, Long> rdvParStatut = new LinkedHashMap<>();
        rdvParStatut.put("PREVU", rdvPrevus);
        rdvParStatut.put("TERMINE", rdvTermines);
        rdvParStatut.put("ANNULE", rdvAnnules);
        rdvParStatut.put("EN_ATTENTE", rdvRepository.countByStatut(StatutRendezVous.EN_ATTENTE_APPROBATION));

        // Analyses par type
        List<Analyse> toutesAnalyses = analyseRepository.findAll();
        Map<String, Long> analysesParType = toutesAnalyses.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getTypeAnalyse() != null ? a.getTypeAnalyse() : "Autre",
                        Collectors.counting()
                ));

        // Nouveaux patients par semaine (4 dernières semaines)
        List<StatistiquesDTO.SemaineStat> nouveauxPatients = new ArrayList<>();
        List<RendezVous> rdv4semaines = rdvRepository.findFromDate(
                LocalDate.now().minusWeeks(4).atStartOfDay());

        for (int s = 3; s >= 0; s--) {
            LocalDate debutSemaine = LocalDate.now().minusWeeks(s).with(DayOfWeek.MONDAY);
            LocalDate finSemaine = debutSemaine.plusDays(6);
            long count = rdv4semaines.stream()
                    .filter(r -> {
                        LocalDate d = r.getDateHeure().toLocalDate();
                        return !d.isBefore(debutSemaine) && !d.isAfter(finSemaine);
                    })
                    .map(r -> r.getPatient().getId())
                    .distinct()
                    .count();
            nouveauxPatients.add(new StatistiquesDTO.SemaineStat("S" + (4 - s), count));
        }

        return StatistiquesDTO.builder()
                .totalPatients(totalPatients)
                .totalRdv(totalRdv)
                .totalAnalyses(totalAnalyses)
                .rdvUrgents(rdvUrgents)
                .rdvAnnules(rdvAnnules)
                .rdvPrevus(rdvPrevus)
                .rdvTermines(rdvTermines)
                .analysesEnAttente(analysesEnAttente)
                .analysesExaminees(analysesExaminees)
                .tauxAnnulation(tauxAnnulation)
                .tauxUrgence(tauxUrgence)
                .rdvParJour(rdvParJour)
                .rdvParStatut(rdvParStatut)
                .analysesParType(analysesParType)
                .nouveauxPatientsParSemaine(nouveauxPatients)
                .build();
    }
}