package com.cabinet.ophtalmologie.config;

import com.cabinet.ophtalmologie.model.CreneauDisponible;
import com.cabinet.ophtalmologie.model.Utilisateur;
import com.cabinet.ophtalmologie.model.enums.JourSemaine;
import com.cabinet.ophtalmologie.model.enums.Role;
import com.cabinet.ophtalmologie.repository.CreneauDisponibleRepository;
import com.cabinet.ophtalmologie.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final CreneauDisponibleRepository creneauRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultUsers();
        createDefaultCreneaux();
    }

    private void createDefaultUsers() {
        // Créer le compte Médecin par défaut
        if (!utilisateurRepository.existsByUsername("medecin")) {
            Utilisateur medecin = Utilisateur.builder()
                    .username("medecin")
                    .email("medecin@cabinet.com")
                    .password(passwordEncoder.encode("medecin123"))
                    .role(Role.MEDECIN)
                    .actif(true)
                    .build();
            utilisateurRepository.save(medecin);
            log.info("✅ Compte MÉDECIN créé — username: medecin / password: medecin123");
        }

        // Créer le compte Secrétaire par défaut
        if (!utilisateurRepository.existsByUsername("secretaire")) {
            Utilisateur secretaire = Utilisateur.builder()
                    .username("secretaire")
                    .email("secretaire@cabinet.com")
                    .password(passwordEncoder.encode("secretaire123"))
                    .role(Role.SECRETAIRE)
                    .actif(true)
                    .build();
            utilisateurRepository.save(secretaire);
            log.info("✅ Compte SECRÉTAIRE créé — username: secretaire / password: secretaire123");
        }
    }

    private void createDefaultCreneaux() {
        if (creneauRepository.count() == 0) {
            // Créneaux du lundi au vendredi : 8h-12h et 14h-18h (par tranches de 30 min)
            JourSemaine[] joursOuvrables = {
                JourSemaine.LUNDI, JourSemaine.MARDI, JourSemaine.MERCREDI,
                JourSemaine.JEUDI, JourSemaine.VENDREDI
            };

            for (JourSemaine jour : joursOuvrables) {
                // Créneaux du matin : 08:00 - 12:00
                for (int h = 8; h < 12; h++) {
                    creneauRepository.save(CreneauDisponible.builder()
                            .jourSemaine(jour)
                            .heureDebut(LocalTime.of(h, 0))
                            .heureFin(LocalTime.of(h, 30))
                            .actif(true)
                            .build());
                    creneauRepository.save(CreneauDisponible.builder()
                            .jourSemaine(jour)
                            .heureDebut(LocalTime.of(h, 30))
                            .heureFin(LocalTime.of(h + 1, 0))
                            .actif(true)
                            .build());
                }
                // Créneaux de l'après-midi : 14:00 - 18:00
                for (int h = 14; h < 18; h++) {
                    creneauRepository.save(CreneauDisponible.builder()
                            .jourSemaine(jour)
                            .heureDebut(LocalTime.of(h, 0))
                            .heureFin(LocalTime.of(h, 30))
                            .actif(true)
                            .build());
                    creneauRepository.save(CreneauDisponible.builder()
                            .jourSemaine(jour)
                            .heureDebut(LocalTime.of(h, 30))
                            .heureFin(LocalTime.of(h + 1, 0))
                            .actif(true)
                            .build());
                }
            }

            // Samedi matin : 08:00 - 12:00
            for (int h = 8; h < 12; h++) {
                creneauRepository.save(CreneauDisponible.builder()
                        .jourSemaine(JourSemaine.SAMEDI)
                        .heureDebut(LocalTime.of(h, 0))
                        .heureFin(LocalTime.of(h, 30))
                        .actif(true)
                        .build());
                creneauRepository.save(CreneauDisponible.builder()
                        .jourSemaine(JourSemaine.SAMEDI)
                        .heureDebut(LocalTime.of(h, 30))
                        .heureFin(LocalTime.of(h + 1, 0))
                        .actif(true)
                        .build());
            }

            log.info("✅ Créneaux par défaut créés (Lundi-Vendredi 8h-12h/14h-18h + Samedi 8h-12h)");
        }
    }
}
