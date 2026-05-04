package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.RendezVousDTO;
import com.cabinet.ophtalmologie.exception.BadRequestException;
import com.cabinet.ophtalmologie.exception.ResourceNotFoundException;
import com.cabinet.ophtalmologie.model.Patient;
import com.cabinet.ophtalmologie.model.RendezVous;
import com.cabinet.ophtalmologie.model.Utilisateur;
import com.cabinet.ophtalmologie.model.enums.Role;
import com.cabinet.ophtalmologie.model.enums.JourSemaine;
import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import com.cabinet.ophtalmologie.repository.CreneauDisponibleRepository;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import com.cabinet.ophtalmologie.repository.RendezVousRepository;
import com.cabinet.ophtalmologie.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;




@Service
@RequiredArgsConstructor
@Slf4j
public class RendezVousService {

    private final RendezVousRepository rdvRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CreneauDisponibleRepository creneauRepository;
    private final RendezvousSuggestionService rendezvousSuggestionService;

    public List<RendezVousDTO> getAllRendezVous() {
        return rdvRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public RendezVousDTO getRendezVousById(Long id) {
        return toDTO(rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id)));
    }

    public List<RendezVousDTO> getRendezVousByPatient(Long patientId) {
        return rdvRepository.findByPatientIdOrderByDateHeureDesc(patientId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<RendezVousDTO> getPlanningJournee(LocalDate date) {
        LocalDateTime debut = date.atStartOfDay();
        LocalDateTime fin = date.plusDays(1).atStartOfDay();
        return rdvRepository.findByJournee(debut, fin).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Demandes en attente d'approbation (pour la secrétaire)
    public List<RendezVousDTO> getDemandesEnAttente() {
        return rdvRepository.findAll().stream()
                .filter(r -> r.getStatut() == StatutRendezVous.EN_ATTENTE_APPROBATION)
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<String> getCreneauxDisponibles(LocalDate date) {
        JourSemaine jourSemaine = convertDayOfWeek(date.getDayOfWeek());
        if (jourSemaine == null) return List.of();

        var creneaux = creneauRepository.findByJourSemaineAndActifTrue(jourSemaine);
        LocalDateTime debutJournee = date.atStartOfDay();
        LocalDateTime finJournee = date.plusDays(1).atStartOfDay();
        List<RendezVous> rdvExistants = rdvRepository.findByJournee(debutJournee, finJournee);

        return creneaux.stream()
                .filter(creneau -> {
                    LocalDateTime debutCreneau = date.atTime(creneau.getHeureDebut());
                    return rdvExistants.stream()
                            .filter(r -> r.getStatut() == StatutRendezVous.PREVU
                                    || r.getStatut() == StatutRendezVous.EN_COURS)
                            .noneMatch(rdv -> rdv.getDateHeure().equals(debutCreneau));
                })
                .map(c -> c.getHeureDebut() + " - " + c.getHeureFin())
                .collect(Collectors.toList());
    }

    // Patient soumet une demande avec 1 ou 2 créneaux
    @Transactional
    public RendezVousDTO soumettreDemandeRdv(RendezVousDTO dto, String username) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", dto.getPatientId()));

        Utilisateur creePar = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Utilisateur non trouvé"));

        if (dto.getDateHeure() == null) {
            throw new BadRequestException("Au moins un créneau est obligatoire");
        }
        if (dto.getDateHeure().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("La date du rendez-vous doit être dans le futur");
        }
        if (dto.getDateHeureAlt() != null && dto.getDateHeureAlt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Le deuxième créneau doit être dans le futur");
        }

        RendezVous rdv = RendezVous.builder()
                .patient(patient)
                .dateHeure(dto.getDateHeure())
                .dateHeureAlt(dto.getDateHeureAlt())
                .dureeMinutes(dto.getDureeMinutes() != null ? dto.getDureeMinutes() : 30)
                .motif(dto.getMotif())
                .urgent(false)
                .statut(creePar.getRole() == Role.SECRETAIRE 
                    ? StatutRendezVous.PREVU 
                    : StatutRendezVous.EN_ATTENTE_APPROBATION)
                .creePar(creePar)
                .build();

        RendezVous saved = rdvRepository.save(rdv);

        if (creePar.getRole() == Role.SECRETAIRE) {
            try {
                Utilisateur user = patient.getUtilisateur();
                if (user != null && user.getEmail() != null) {
                    emailService.envoyerConfirmationRdv(
                        user.getEmail(),
                        patient.getNomComplet(),
                        saved.getDateHeure()
                    );
                }
            } catch (Exception e) {
                log.warn("Email non envoyé : {}", e.getMessage());
            }
        }

        return toDTO(saved);
    }

    // Secrétaire approuve une demande en choisissant le créneau
    private final EmailService emailService;

    @Transactional
    public RendezVousDTO approuverDemande(Long id, LocalDateTime dateHeureChoisie) {

        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));

        if (rdv.getStatut() != StatutRendezVous.EN_ATTENTE_APPROBATION) {
            throw new BadRequestException("Cette demande n'est plus en attente d'approbation");
        }

        // Vérifier que le créneau choisi est bien un des deux proposés
        boolean estCreneau1 = rdv.getDateHeure().equals(dateHeureChoisie);
        boolean estCreneau2 = rdv.getDateHeureAlt() != null && rdv.getDateHeureAlt().equals(dateHeureChoisie);

        if (!estCreneau1 && !estCreneau2) {
            throw new BadRequestException("Le créneau choisi ne correspond pas aux créneaux proposés");
        }

        // Vérifier conflit
        int duree = rdv.getDureeMinutes();
        LocalDateTime fin = dateHeureChoisie.plusMinutes(duree);
        List<RendezVous> conflits = rdvRepository.findConflits(dateHeureChoisie, fin);
        conflits.removeIf(r -> r.getId().equals(id));
        if (!conflits.isEmpty()) {
            throw new BadRequestException("Conflit de créneau avec un autre rendez-vous");
        }

        rdv.setDateHeure(dateHeureChoisie);
        rdv.setDateHeureAlt(null);
        rdv.setStatut(StatutRendezVous.PREVU);

        // Envoyer l'email de confirmation
        try {
            Utilisateur user = rdv.getPatient().getUtilisateur();
            if (user != null && user.getEmail() != null) {
                emailService.envoyerConfirmationRdv(
                    user.getEmail(),
                    rdv.getPatient().getNomComplet(),
                    dateHeureChoisie
                );
            }
        } catch (Exception e) {
            log.warn("Email non envoyé mais RDV approuvé : {}", e.getMessage());
        }

        return toDTO(rdvRepository.save(rdv));
    }

    // Secrétaire refuse une demande
    @Transactional
    public RendezVousDTO refuserDemande(Long id) {

        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));

        rdv.setStatut(StatutRendezVous.ANNULE);
        rdvRepository.save(rdv);

        List<String> alternatives = rendezvousSuggestionService.trouverAlternatives(
            rdv.getDateHeure().toLocalDate()
        );

        try {
            Utilisateur user = rdv.getPatient().getUtilisateur();

            if (user != null && user.getEmail() != null && alternatives.size() >= 2) {

                emailService.envoyerPropositionAlternatives(
                        user.getEmail(),
                        rdv.getPatient().getNomComplet(),
                        alternatives.subList(0, 2)
                );
            }

        } catch (Exception e) {
            log.warn("Email alternatives non envoyé : {}", e.getMessage());
        }

        return toDTO(rdv);
    }

    @Transactional
    public RendezVousDTO creerRendezVous(RendezVousDTO dto, String username) {
        return soumettreDemandeRdv(dto, username);
    }

    @Transactional
    public RendezVousDTO creerRendezVousUrgent(RendezVousDTO dto, String username) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", dto.getPatientId()));
        Utilisateur creePar = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Utilisateur non trouvé"));

        if (dto.getDateHeure() == null) dto.setDateHeure(trouverProchainCreneauLibre());

        RendezVous rdv = RendezVous.builder()
                .patient(patient)
                .dateHeure(dto.getDateHeure())
                .dureeMinutes(30)
                .motif(dto.getMotif())
                .urgent(true)
                .statut(StatutRendezVous.PREVU)
                .creePar(creePar)
                .build();

        RendezVous saved = rdvRepository.save(rdv);

        try {
            Utilisateur user = patient.getUtilisateur();
            if (user != null && user.getEmail() != null) {
                emailService.envoyerRdvUrgent(
                    user.getEmail(),
                    patient.getNomComplet(),
                    saved.getDateHeure(),
                    saved.getMotif()
                );
            }
        } catch (Exception e) {
            log.warn("Email RDV urgent non envoye : {}", e.getMessage());
        }

        return toDTO(saved);
    }

    @Transactional
    public RendezVousDTO modifierRendezVous(Long id, RendezVousDTO dto) {
        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));

        if (rdv.getStatut() == StatutRendezVous.TERMINE || rdv.getStatut() == StatutRendezVous.ANNULE) {
            throw new BadRequestException("Impossible de modifier un RDV terminé ou annulé");
        }

        if (dto.getDateHeure() != null && !dto.getDateHeure().equals(rdv.getDateHeure())) {
            int duree = dto.getDureeMinutes() != null ? dto.getDureeMinutes() : rdv.getDureeMinutes();
            List<RendezVous> conflits = rdvRepository.findConflits(dto.getDateHeure(), dto.getDateHeure().plusMinutes(duree));
            conflits.removeIf(r -> r.getId().equals(id));
            if (!conflits.isEmpty()) throw new BadRequestException("Conflit de créneau");
            rdv.setDateHeure(dto.getDateHeure());
        }

        if (dto.getMotif() != null) rdv.setMotif(dto.getMotif());
        if (dto.getDureeMinutes() != null) rdv.setDureeMinutes(dto.getDureeMinutes());
        if (dto.getStatut() != null) rdv.setStatut(dto.getStatut());
        if (dto.getNotesMedecin() != null) rdv.setNotesMedecin(dto.getNotesMedecin());

        return toDTO(rdvRepository.save(rdv));
    }

    @Transactional
    public RendezVousDTO annulerRendezVous(Long id) {
        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));
        if (rdv.getStatut() == StatutRendezVous.TERMINE) {
            throw new BadRequestException("Impossible d'annuler un RDV déjà terminé");
        }
        rdv.setStatut(StatutRendezVous.ANNULE);
        RendezVous saved = rdvRepository.save(rdv);

        try {
            Utilisateur user = saved.getPatient().getUtilisateur();
            if (user != null && user.getEmail() != null) {
                emailService.envoyerAnnulationRdv(
                    user.getEmail(),
                    saved.getPatient().getNomComplet(),
                    saved.getDateHeure(),
                    null
                );
            }
        } catch (Exception e) {
            log.warn("Email annulation non envoyé : {}", e.getMessage());
        }

        return toDTO(saved);
    }

    private LocalDateTime trouverProchainCreneauLibre() {
        LocalDate date = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            List<String> creneaux = getCreneauxDisponibles(date.plusDays(i));
            if (!creneaux.isEmpty()) {
                String heure = creneaux.get(0).split(" - ")[0];
                return date.plusDays(i).atTime(LocalTime.parse(heure));
            }
        }
        return date.plusWeeks(1).atTime(8, 0);
    }

    private JourSemaine convertDayOfWeek(java.time.DayOfWeek d) {
        return switch (d) {
            case MONDAY -> JourSemaine.LUNDI;
            case TUESDAY -> JourSemaine.MARDI;
            case WEDNESDAY -> JourSemaine.MERCREDI;
            case THURSDAY -> JourSemaine.JEUDI;
            case FRIDAY -> JourSemaine.VENDREDI;
            case SATURDAY -> JourSemaine.SAMEDI;
            case SUNDAY -> null;
        };
    }

    private RendezVousDTO toDTO(RendezVous rdv) {
        return RendezVousDTO.builder()
                .id(rdv.getId())
                .patientId(rdv.getPatient().getId())
                .patientNomComplet(rdv.getPatient().getNomComplet())
                .dateHeure(rdv.getDateHeure())
                .dateHeureAlt(rdv.getDateHeureAlt())
                .dureeMinutes(rdv.getDureeMinutes())
                .motif(rdv.getMotif())
                .urgent(rdv.getUrgent())
                .statut(rdv.getStatut())
                .notesMedecin(rdv.getNotesMedecin())
                .creeParId(rdv.getCreePar() != null ? rdv.getCreePar().getId() : null)
                .creeParUsername(rdv.getCreePar() != null ? rdv.getCreePar().getUsername() : null)
                .dateCreation(rdv.getDateCreation())
                .build();
    }

    @Transactional
    public RendezVousDTO modifierRdvSecretaire(Long id, RendezVousDTO dto) {
        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RDV", id));

        rdv.setDateHeure(dto.getDateHeure());
        rdv.setMotif(dto.getMotif());
        rdv.setNotesMedecin(dto.getMotifModification());

        rdv.setStatut(StatutRendezVous.PREVU);

        return toDTO(rdvRepository.save(rdv));
    }

    @Transactional
    public RendezVousDTO annulerParSecretaire(Long id, String motif) {
        RendezVous rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));

        rdv.setStatut(StatutRendezVous.ANNULE);
        rdv.setMotifAnnulation(motif);
        RendezVous saved = rdvRepository.save(rdv);

        try {
            Utilisateur user = saved.getPatient().getUtilisateur();
            if (user != null && user.getEmail() != null) {
                emailService.envoyerAnnulationRdv(
                    user.getEmail(),
                    saved.getPatient().getNomComplet(),
                    saved.getDateHeure(),
                    motif
                );
            }
        } catch (Exception e) {
            log.warn("Email annulation non envoyé : {}", e.getMessage());
        }

        return toDTO(saved);
    }

    @Transactional
    public RendezVous getById(Long id) {
    return rdvRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("RDV introuvable"));
    }

    @Transactional
    public RendezVous update(Long id, Map<String, Object> data) {
        RendezVous rdv = getById(id);
        if (data.containsKey("dateHeure")) {
            rdv.setDateHeure(LocalDateTime.parse((String) data.get("dateHeure")));
        }
        return rdvRepository.save(rdv);
    }
}