package com.cabinet.ophtalmologie.controller;

import com.cabinet.ophtalmologie.dto.AnalyseDTO;
import com.cabinet.ophtalmologie.dto.ApiResponse;
import com.cabinet.ophtalmologie.dto.CommentaireRequest;
import com.cabinet.ophtalmologie.service.AnalyseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class AnalyseController {

    private final AnalyseService analyseService;

    // POST /api/analyses/upload — Déposer une analyse (Patient)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse> uploadAnalyse(
            @RequestParam("patientId") Long patientId,
            @RequestParam("typeAnalyse") String typeAnalyse,
            @RequestParam("fichier") MultipartFile fichier) {
        AnalyseDTO analyse = analyseService.uploadAnalyse(patientId, typeAnalyse, fichier);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Analyse déposée avec succès", analyse));
    }

    // GET /api/analyses/patient/{patientId} — Analyses d'un patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'PATIENT')")
    public ResponseEntity<List<AnalyseDTO>> getAnalysesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(analyseService.getAnalysesByPatient(patientId));
    }

    // GET /api/analyses/{id} — Détails d'une analyse
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'PATIENT')")
    public ResponseEntity<AnalyseDTO> getAnalyseById(@PathVariable Long id) {
        return ResponseEntity.ok(analyseService.getAnalyseById(id));
    }

    // GET /api/analyses/en-attente — Analyses en attente d'examen (Médecin)
    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<List<AnalyseDTO>> getAnalysesEnAttente() {
        return ResponseEntity.ok(analyseService.getAnalysesEnAttente());
    }

    // PUT /api/analyses/{id}/commentaire — Ajouter un commentaire médical (Médecin)
    @PutMapping("/{id}/commentaire")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<ApiResponse> ajouterCommentaire(
            @PathVariable Long id,
            @Valid @RequestBody CommentaireRequest request) {
        AnalyseDTO analyse = analyseService.ajouterCommentaire(id, request.getCommentaire());
        return ResponseEntity.ok(ApiResponse.success("Commentaire ajouté avec succès", analyse));
    }

    // PUT /api/analyses/{id}/urgent — Marquer comme urgente (Médecin)
    @PutMapping("/{id}/urgent")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<ApiResponse> marquerUrgente(@PathVariable Long id) {
        AnalyseDTO analyse = analyseService.marquerUrgente(id);
        return ResponseEntity.ok(ApiResponse.success("Analyse marquée comme urgente", analyse));
    }
}
