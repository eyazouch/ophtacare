package com.cabinet.ophtalmologie.controller;

import com.cabinet.ophtalmologie.dto.DashboardDTO;
import com.cabinet.ophtalmologie.dto.StatistiquesDTO;
import com.cabinet.ophtalmologie.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getStatistiques());
    }

    @GetMapping("/statistiques")
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<StatistiquesDTO> getStatistiques() {
        return ResponseEntity.ok(dashboardService.getStatistiquesAvancees());
    }
}