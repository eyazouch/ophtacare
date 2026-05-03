package com.cabinet.ophtalmologie.controller;

import com.cabinet.ophtalmologie.dto.ApiResponse;
import com.cabinet.ophtalmologie.dto.RendezVousDTO;
import com.cabinet.ophtalmologie.service.RendezVousService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rdv")
@RequiredArgsConstructor
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<RendezVousDTO>> getAllRendezVous() {
        return ResponseEntity.ok(rendezVousService.getAllRendezVous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVousDTO> getRendezVousById(@PathVariable Long id) {
        return ResponseEntity.ok(rendezVousService.getRendezVousById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<RendezVousDTO>> getRendezVousByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(rendezVousService.getRendezVousByPatient(patientId));
    }

    @GetMapping("/disponibilites")
    public ResponseEntity<List<String>> getCreneauxDisponibles(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rendezVousService.getCreneauxDisponibles(date));
    }

    @GetMapping("/planning")
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<RendezVousDTO>> getPlanningJournee(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rendezVousService.getPlanningJournee(date));
    }

    // Demandes en attente d'approbation
    @GetMapping("/demandes")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<RendezVousDTO>> getDemandesEnAttente() {
        return ResponseEntity.ok(rendezVousService.getDemandesEnAttente());
    }

    // Patient soumet une demande (1 ou 2 créneaux)
    @PostMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'SECRETAIRE')")
    public ResponseEntity<ApiResponse> soumettreDemandeRdv(
            @Valid @RequestBody RendezVousDTO dto,
            Authentication authentication) {
        RendezVousDTO created = rendezVousService.soumettreDemandeRdv(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Demande de rendez-vous soumise avec succès", created));
    }

    // Secrétaire approuve une demande
    @PutMapping("/{id}/approuver")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<ApiResponse> approuverDemande(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        LocalDateTime dateChoisie = LocalDateTime.parse(body.get("dateHeureChoisie"));
        RendezVousDTO updated = rendezVousService.approuverDemande(id, dateChoisie);
        return ResponseEntity.ok(ApiResponse.success("Rendez-vous approuvé et confirmé", updated));
    }

    // Secrétaire refuse une demande
    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<ApiResponse> refuserDemande(@PathVariable Long id) {
        RendezVousDTO updated = rendezVousService.refuserDemande(id);
        return ResponseEntity.ok(ApiResponse.success("Demande refusée", updated));
    }

    @PostMapping("/urgent")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<ApiResponse> creerRendezVousUrgent(
            @Valid @RequestBody RendezVousDTO dto,
            Authentication authentication) {
        RendezVousDTO created = rendezVousService.creerRendezVousUrgent(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rendez-vous URGENT créé", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<ApiResponse> modifierRendezVous(
            @PathVariable Long id, @RequestBody RendezVousDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Rendez-vous modifié",
                rendezVousService.modifierRendezVous(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'PATIENT')")
    public ResponseEntity<ApiResponse> annulerRendezVous(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Rendez-vous annulé",
                rendezVousService.annulerRendezVous(id)));
    }

    @PutMapping("/{id}/modifier-secretaire")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<ApiResponse> modifierParSecretaire(
            @PathVariable Long id,
            @RequestBody RendezVousDTO dto) {

        RendezVousDTO updated = rendezVousService.modifierRendezVous(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success("Rendez-vous modifié par la secrétaire", updated)
        );
    }
    @PutMapping("/{id}/annuler-secretaire")
    @PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<ApiResponse> annulerParSecretaire(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String motif = body.get("motif");

        RendezVousDTO updated = rendezVousService.annulerParSecretaire(id, motif);

        return ResponseEntity.ok(
                ApiResponse.success("Rendez-vous annulé par la secrétaire", updated)
        );
    }

}