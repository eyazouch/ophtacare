package com.cabinet.ophtalmologie.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

import java.util.Set;
import java.util.LinkedHashSet;
import com.cabinet.ophtalmologie.repository.CreneauDisponibleRepository;
import com.cabinet.ophtalmologie.model.enums.JourSemaine;
import java.util.stream.Collectors;



@Service
public class RendezvousSuggestionService {

    private final CreneauDisponibleRepository creneauRepository;

    public RendezvousSuggestionService(CreneauDisponibleRepository creneauRepository) {
        this.creneauRepository = creneauRepository;
    }

    public List<String> trouverAlternatives(LocalDate dateRef) {

        Set<String> resultats = new LinkedHashSet<>();

        // 1. même jour
        resultats.addAll(getDisponibles(dateRef));

        // si déjà 2 → stop
        if (resultats.size() >= 2) {
            return new ArrayList<>(resultats).subList(0, 2);
        }

        // 2. jours suivants
        for (int i = 1; i <= 3; i++) {
            resultats.addAll(getDisponibles(dateRef.plusDays(i)));
            if (resultats.size() >= 2) break;
        }

        return new ArrayList<>(resultats).subList(0, Math.min(2, resultats.size()));
    }

    private List<String> getDisponibles(LocalDate date) {

        JourSemaine jour = convert(date.getDayOfWeek());
        if (jour == null) return List.of();

        return creneauRepository.findByJourSemaineAndActifTrue(jour)
                .stream()
                .map(c -> c.getHeureDebut() + " - " + c.getHeureFin())
                .collect(Collectors.toList());
    }

    private JourSemaine convert(java.time.DayOfWeek d) {
        return switch (d) {
            case MONDAY -> JourSemaine.LUNDI;
            case TUESDAY -> JourSemaine.MARDI;
            case WEDNESDAY -> JourSemaine.MERCREDI;
            case THURSDAY -> JourSemaine.JEUDI;
            case FRIDAY -> JourSemaine.VENDREDI;
            case SATURDAY -> JourSemaine.SAMEDI;
            default -> null;
        };
    }
}