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