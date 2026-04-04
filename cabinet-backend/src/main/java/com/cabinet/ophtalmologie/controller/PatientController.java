package com.cabinet.ophtalmologie.controller;

import com.cabinet.ophtalmologie.dto.PatientDTO;
import com.cabinet.ophtalmologie.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<Page<PatientDTO>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(patientService.getAllPatients(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE', 'PATIENT')")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE', 'PATIENT')")
    public ResponseEntity<PatientDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(patientService.getByUserId(userId));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<Page<PatientDTO>> searchPatients(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(patientService.searchPatients(q, page, size));
    }
}