package com.cabinet.ophtalmologie.controller;

import com.cabinet.ophtalmologie.dto.ApiResponse;
import com.cabinet.ophtalmologie.dto.ConsultationDTO;
import com.cabinet.ophtalmologie.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    // POST /api/consultations — Créer une consultation (Médecin)
    @PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<ApiResponse> creerConsultation(
            @Valid @RequestBody ConsultationDTO dto) {
        ConsultationDTO created = consultationService.creerConsultation(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Consultation créée avec succès", created));
    }

    // GET /api/consultations/patient/{patientId} — Historique consultations d'un patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'PATIENT')")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByPatient(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatient(patientId));
    }

    // PUT /api/consultations/{id} — Modifier une consultation (Médecin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<ApiResponse> modifierConsultation(
            @PathVariable Long id,
            @RequestBody ConsultationDTO dto) {
        ConsultationDTO updated = consultationService.modifierConsultation(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Consultation modifiée", updated));
    }
}
