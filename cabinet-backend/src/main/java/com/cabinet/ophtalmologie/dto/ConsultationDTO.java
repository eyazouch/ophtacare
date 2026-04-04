package com.cabinet.ophtalmologie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationDTO {

    private Long id;

    @NotNull(message = "L'ID du rendez-vous est obligatoire")
    private Long rendezVousId;

    @NotNull(message = "L'ID du patient est obligatoire")
    private Long patientId;

    private String patientNomComplet;

    @NotBlank(message = "Le diagnostic est obligatoire")
    private String diagnostic;

    private String traitement;

    private String observations;

    private LocalDateTime dateConsultation;
}
