package com.cabinet.ophtalmologie.dto;

import com.cabinet.ophtalmologie.model.enums.Sexe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String cin;
    private String telephone;
    private String email;
    private LocalDate dateNaissance;
    private String adresse;
    private Sexe sexe;
    private String groupeSanguin;
    private int nombreRdv;
    private int nombreAnalyses;
}
