package com.cabinet.ophtalmologie.model;

import com.cabinet.ophtalmologie.model.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom d'utilisateur est obligatoire")
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Column(nullable = false)
    private String password;

    @NotNull(message = "Le rôle est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @Column(name = "date_creation", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    // ===== RELATIONS =====

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Patient patient;

    @OneToMany(mappedBy = "destinataire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();
}
