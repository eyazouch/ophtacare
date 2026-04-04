package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.TypeNotification;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destinataire")
    private Utilisateur destinataire;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String objet;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Column(nullable = false)
    @Builder.Default
    private Boolean lue = false;

    @Column(name = "date_envoi", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateEnvoi = LocalDateTime.now();
}
