package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.AnalyseDTO;
import com.cabinet.ophtalmologie.exception.BadRequestException;
import com.cabinet.ophtalmologie.exception.ResourceNotFoundException;
import com.cabinet.ophtalmologie.model.Analyse;
import com.cabinet.ophtalmologie.model.Patient;
import com.cabinet.ophtalmologie.model.enums.StatutAnalyse;
import com.cabinet.ophtalmologie.repository.AnalyseRepository;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseService {

    private final AnalyseRepository analyseRepository;
    private final PatientRepository patientRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // Upload d'une analyse par le patient
    @Transactional
    public AnalyseDTO uploadAnalyse(Long patientId, String typeAnalyse, MultipartFile fichier) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", patientId));

        // Valider le fichier
        if (fichier.isEmpty()) {
            throw new BadRequestException("Le fichier est vide");
        }

        String contentType = fichier.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf")
                && !contentType.equals("image/jpeg")
                && !contentType.equals("image/png"))) {
            throw new BadRequestException("Format de fichier non supporté. Formats acceptés : PDF, JPEG, PNG");
        }

        if (fichier.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("La taille du fichier ne doit pas dépasser 10 Mo");
        }

        // Sauvegarder le fichier
        String fichierNomOriginal = fichier.getOriginalFilename();
        String extension = fichierNomOriginal != null ?
                fichierNomOriginal.substring(fichierNomOriginal.lastIndexOf(".")) : ".pdf";
        String fichierNomUnique = UUID.randomUUID().toString() + extension;

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fichierNomUnique);
            Files.copy(fichier.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Erreur lors de l'upload du fichier", e);
            throw new BadRequestException("Erreur lors de l'enregistrement du fichier");
        }

        // Créer l'analyse en BDD
        Analyse analyse = Analyse.builder()
                .patient(patient)
                .typeAnalyse(typeAnalyse)
                .fichierPath(fichierNomUnique)
                .fichierNom(fichierNomOriginal)
                .statut(StatutAnalyse.EN_ATTENTE)
                .build();

        analyse = analyseRepository.save(analyse);
        log.info("Analyse uploadée — Patient: {}, Type: {}, Fichier: {}",
                patient.getNomComplet(), typeAnalyse, fichierNomOriginal);

        return toDTO(analyse);
    }

    // Analyses d'un patient
    public List<AnalyseDTO> getAnalysesByPatient(Long patientId) {
        return analyseRepository.findByPatientIdOrderByDateDepotDesc(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Détails d'une analyse
    public AnalyseDTO getAnalyseById(Long id) {
        Analyse analyse = analyseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analyse", id));
        return toDTO(analyse);
    }

    // Analyses en attente d'examen (pour le médecin)
    public List<AnalyseDTO> getAnalysesEnAttente() {
        return analyseRepository.findByStatutOrderByDateDepotAsc(StatutAnalyse.EN_ATTENTE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Ajouter un commentaire médical
    @Transactional
    public AnalyseDTO ajouterCommentaire(Long id, String commentaire) {
        Analyse analyse = analyseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analyse", id));

        analyse.setCommentaireMedecin(commentaire);
        analyse.setStatut(StatutAnalyse.EXAMINEE);
        analyse.setDateExamen(LocalDateTime.now());

        analyse = analyseRepository.save(analyse);
        log.info("Analyse {} examinée par le médecin", id);

        return toDTO(analyse);
    }

    // Marquer une analyse comme urgente
    @Transactional
    public AnalyseDTO marquerUrgente(Long id) {
        Analyse analyse = analyseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analyse", id));

        analyse.setUrgent(true);
        analyse = analyseRepository.save(analyse);
        log.info("⚠️ Analyse {} marquée comme URGENTE", id);

        return toDTO(analyse);
    }

    // Mapper Entity -> DTO
    private AnalyseDTO toDTO(Analyse analyse) {
        return AnalyseDTO.builder()
                .id(analyse.getId())
                .patientId(analyse.getPatient().getId())
                .patientNomComplet(analyse.getPatient().getNomComplet())
                .typeAnalyse(analyse.getTypeAnalyse())
                .fichierPath(analyse.getFichierPath())
                .fichierNom(analyse.getFichierNom())
                .dateDepot(analyse.getDateDepot())
                .commentaireMedecin(analyse.getCommentaireMedecin())
                .urgent(analyse.getUrgent())
                .statut(analyse.getStatut())
                .dateExamen(analyse.getDateExamen())
                .build();
    }
}