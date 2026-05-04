package com.cabinet.ophtalmologie.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void envoyerConfirmationRdv(String emailPatient, String nomPatient, LocalDateTime dateHeure) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8"
            );

            helper.setFrom("khlif.oumayma30@gmail.com", "OphtaCare");
            helper.setTo(emailPatient);
            helper.setSubject("Confirmation de votre rendez-vous médical — OphtaCare");

            String contenu = """
                <div style="font-family: Arial, sans-serif; line-height:1.6;">

                    <p>Bonjour <strong>%s</strong>,</p>

                    <p>Votre rendez-vous médical est <strong>confirmé</strong>.</p>

                    <p><strong>Détails du rendez-vous:</strong><br>
                    Date et heure : %s</p>

                    <p>Merci de vous présenter au cabinet 5 à 10 minutes avant l’heure prévue.</p>
                    <p>En cas d’empêchement, veuillez nous contacter afin de reprogrammer votre rendez-vous.</p>

                    <p>Cordialement,<br><strong>Cabinet OphtaCare</strong></p>
                </div>
                """.formatted(
                    nomPatient,
                    dateHeure.format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"))
                );

            helper.setText(contenu, true);

            mailSender.send(message);

            log.info("Email envoyé à {}", emailPatient);

        } catch (Exception e) {
            log.error("Erreur envoi email à {} : {}", emailPatient, e.getMessage());
        }
    }

    public void envoyerRdvUrgent(String emailPatient, String nomPatient, LocalDateTime dateHeure, String motif) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8"
            );

            helper.setFrom("khlif.oumayma30@gmail.com", "OphtaCare");
            helper.setTo(emailPatient);
            helper.setSubject("Rendez-vous urgent planifie pour vous — OphtaCare");

            String motifLigne = (motif != null && !motif.isBlank())
                    ? "<p><strong>Motif :</strong> " + motif + "</p>"
                    : "";

            String contenu = """
                <div style="font-family: Arial, sans-serif; line-height:1.6;">
                    <p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;">
                        <strong>Attention — Rendez-vous urgent</strong>
                    </p>

                    <p>Bonjour <strong>%s</strong>,</p>

                    <p>Suite a l'examen de vos analyses, votre medecin a estime que votre etat
                    necessite une consultation urgente. Un rendez-vous a ete planifie pour vous :</p>

                    <p style="background:#f0fdf4;border-left:4px solid #059669;padding:12px 16px;border-radius:4px;">
                        <strong>Date et heure :</strong> %s
                    </p>

                    %s

                    <p>Merci de vous presenter au cabinet a l'heure indiquee. En cas d'empechement,
                    veuillez nous contacter dans les plus brefs delais.</p>

                    <p>Cordialement,<br><strong>Cabinet OphtaCare</strong></p>
                </div>
                """.formatted(
                    nomPatient,
                    dateHeure.format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'a' HH:mm")),
                    motifLigne
                );

            helper.setText(contenu, true);
            mailSender.send(message);
            log.info("Email RDV urgent envoye a {}", emailPatient);

        } catch (Exception e) {
            log.error("Erreur envoi email RDV urgent a {} : {}", emailPatient, e.getMessage());
        }
    }

    public void envoyerAnnulationRdv(String emailPatient, String nomPatient, LocalDateTime dateHeure, String motif) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8"
            );

            helper.setFrom("khlif.oumayma30@gmail.com", "OphtaCare");
            helper.setTo(emailPatient);
            helper.setSubject("Annulation de votre rendez-vous médical — OphtaCare");

            String motifLigne = (motif != null && !motif.isBlank())
                    ? "<p><strong>Motif de l'annulation :</strong> " + motif + "</p>"
                    : "";

            String contenu = """
                <div style="font-family: Arial, sans-serif; line-height:1.6;">

                    <p>Bonjour <strong>%s</strong>,</p>

                    <p>Nous vous informons que votre rendez-vous médical prévu le
                    <strong>%s</strong> a été <strong style="color:#dc2626;">annulé</strong>.</p>

                    %s

                    <p>Pour reprogrammer un nouveau rendez-vous, veuillez vous connecter
                    à votre espace patient sur <strong>OphtaCare</strong>.</p>

                    <p>Nous vous prions de nous excuser pour la gêne occasionnée.</p>

                    <p>Cordialement,<br><strong>Cabinet OphtaCare</strong></p>
                </div>
                """.formatted(
                    nomPatient,
                    dateHeure.format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")),
                    motifLigne
                );

            helper.setText(contenu, true);
            mailSender.send(message);
            log.info("Email annulation envoyé à {}", emailPatient);

        } catch (Exception e) {
            log.error("Erreur envoi email annulation à {} : {}", emailPatient, e.getMessage());
        }
    }

    public void envoyerPropositionAlternatives(String email, String nom, List<String> creneaux) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(email);
            helper.setFrom("khlif.oumayma30@gmail.com", "OphtaCare");
            helper.setSubject("Indisponibilité des créneaux demandés — Cabinet OphtaCare");

            String contenu =
                    "<div style='font-family: Arial, sans-serif; line-height:1.6;'>" +

                        "<p>Bonjour <strong>" + nom + "</strong>,</p>" +

                        "<p>Nous vous informons que les créneaux que vous avez demandés ne sont pas disponibles.</p>" +

                        "<p>Afin de faciliter la prise de rendez-vous, nous vous proposons les alternatives suivantes :</p>" +

                        "<ul>" +
                            "<li><strong>" + creneaux.get(0) + "</strong></li>" +
                            "<li><strong>" + creneaux.get(1) + "</strong></li>" +
                        "</ul>" +

                        "<p>Si aucun de ces créneaux ne vous convient, vous pouvez nous contacter afin de convenir d’un autre horaire adapté.</p>" +

                        "<br>" +
                        "<p>Cordialement,<br>" +
                        "<strong>Cabinet OphtaCare</strong></p>" +

                    "</div>";

            helper.setText(contenu, true);
            mailSender.send(message);
            log.info("Email alternatives envoyé à {}", email);

        } catch (Exception e) {
            log.error("Erreur envoi email alternatives: {}", e.getMessage());
        }
    }
}