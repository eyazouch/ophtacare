package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.ConsultationDTO;
import com.cabinet.ophtalmologie.exception.BadRequestException;
import com.cabinet.ophtalmologie.exception.ResourceNotFoundException;
import com.cabinet.ophtalmologie.model.Consultation;
import com.cabinet.ophtalmologie.model.Patient;
import com.cabinet.ophtalmologie.model.RendezVous;
import com.cabinet.ophtalmologie.model.enums.StatutRendezVous;
import com.cabinet.ophtalmologie.repository.ConsultationRepository;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import com.cabinet.ophtalmologie.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final RendezVousRepository rendezVousRepository;
    private final PatientRepository patientRepository;

    // Créer une consultation (après un RDV)
    @Transactional
    public ConsultationDTO creerConsultation(ConsultationDTO dto) {
        RendezVous rdv = rendezVousRepository.findById(dto.getRendezVousId())
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", dto.getRendezVousId()));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", dto.getPatientId()));

        // Vérifier qu'il n'y a pas déjà une consultation pour ce RDV
        if (consultationRepository.findByRendezVousId(rdv.getId()).isPresent()) {
            throw new BadRequestException("Une consultation existe déjà pour ce rendez-vous");
        }

        // Mettre à jour le statut du RDV
        rdv.setStatut(StatutRendezVous.TERMINE);
        rendezVousRepository.save(rdv);

        Consultation consultation = Consultation.builder()
                .rendezVous(rdv)
                .patient(patient)
                .diagnostic(dto.getDiagnostic())
                .traitement(dto.getTraitement())
                .observations(dto.getObservations())
                .build();

        consultation = consultationRepository.save(consultation);
        return toDTO(consultation);
    }

    // Consultations d'un patient
    public List<ConsultationDTO> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findByPatientIdOrderByDateConsultationDesc(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Modifier une consultation
    @Transactional
    public ConsultationDTO modifierConsultation(Long id, ConsultationDTO dto) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", id));

        if (dto.getDiagnostic() != null) consultation.setDiagnostic(dto.getDiagnostic());
        if (dto.getTraitement() != null) consultation.setTraitement(dto.getTraitement());
        if (dto.getObservations() != null) consultation.setObservations(dto.getObservations());

        consultation = consultationRepository.save(consultation);
        return toDTO(consultation);
    }

    private ConsultationDTO toDTO(Consultation c) {
        return ConsultationDTO.builder()
                .id(c.getId())
                .rendezVousId(c.getRendezVous() != null ? c.getRendezVous().getId() : null)
                .patientId(c.getPatient().getId())
                .patientNomComplet(c.getPatient().getNomComplet())
                .diagnostic(c.getDiagnostic())
                .traitement(c.getTraitement())
                .observations(c.getObservations())
                .dateConsultation(c.getDateConsultation())
                .build();
    }
}
