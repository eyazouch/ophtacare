package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.PatientDTO;
import com.cabinet.ophtalmologie.exception.ResourceNotFoundException;
import com.cabinet.ophtalmologie.model.Patient;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public Page<PatientDTO> getAllPatients(int page, int size) {
        return patientRepository.findAll(PageRequest.of(page, size))
                .map(this::toDTO);
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", id));
        return toDTO(patient);
    }

    public PatientDTO getByUserId(Long userId) {
        Patient patient = patientRepository.findByUtilisateurId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient pour userId", userId));
        return toDTO(patient);
    }

    public Page<PatientDTO> searchPatients(String query, int page, int size) {
        return patientRepository.searchPatients(query, PageRequest.of(page, size))
                .map(this::toDTO);
    }

    private PatientDTO toDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setNomComplet(patient.getNomComplet());
        dto.setCin(patient.getCin());
        dto.setTelephone(patient.getTelephone());
        dto.setSexe(patient.getSexe());  // Sexe enum directement, pas de conversion
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setAdresse(patient.getAdresse());
        dto.setGroupeSanguin(patient.getGroupeSanguin());
        dto.setNombreRdv(patient.getRendezVous() != null ? patient.getRendezVous().size() : 0);
        dto.setNombreAnalyses(patient.getAnalyses() != null ? patient.getAnalyses().size() : 0);
        if (patient.getUtilisateur() != null) {
            dto.setEmail(patient.getUtilisateur().getEmail());
        }
        return dto;
    }
}