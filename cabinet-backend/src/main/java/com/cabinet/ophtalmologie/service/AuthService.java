package com.cabinet.ophtalmologie.service;

import com.cabinet.ophtalmologie.dto.LoginRequest;
import com.cabinet.ophtalmologie.dto.LoginResponse;
import com.cabinet.ophtalmologie.dto.RegisterRequest;
import com.cabinet.ophtalmologie.exception.BadRequestException;
import com.cabinet.ophtalmologie.model.Patient;
import com.cabinet.ophtalmologie.model.Utilisateur;
import com.cabinet.ophtalmologie.model.enums.Role;
import com.cabinet.ophtalmologie.repository.PatientRepository;
import com.cabinet.ophtalmologie.repository.UtilisateurRepository;
import com.cabinet.ophtalmologie.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Vérifier si le username existe déjà
        if (utilisateurRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Ce nom d'utilisateur est déjà pris");
        }

        // Vérifier si l'email existe déjà
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        // Vérification anti-doublon par CIN
        if (request.getCin() != null && !request.getCin().isBlank()
                && patientRepository.existsByCin(request.getCin())) {
            throw new BadRequestException("Un patient avec ce CIN existe déjà");
        }

        // Vérification anti-doublon par téléphone
        if (patientRepository.existsByTelephone(request.getTelephone())) {
            throw new BadRequestException("Un patient avec ce numéro de téléphone existe déjà");
        }

        // Créer l'utilisateur
        Utilisateur utilisateur = Utilisateur.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .actif(true)
                .build();
        utilisateur = utilisateurRepository.save(utilisateur);

        // Créer le profil patient
        Patient patient = Patient.builder()
                .utilisateur(utilisateur)
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .cin(request.getCin())
                .telephone(request.getTelephone())
                .dateNaissance(request.getDateNaissance())
                .adresse(request.getAdresse())
                .sexe(request.getSexe())
                .groupeSanguin(request.getGroupeSanguin())
                .build();
        patientRepository.save(patient);

        // Générer le token JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(utilisateur.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .username(utilisateur.getUsername())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .userId(utilisateur.getId())
                .message("Inscription réussie")
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        // Authentifier l'utilisateur
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Récupérer l'utilisateur
        Utilisateur utilisateur = utilisateurRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Utilisateur non trouvé"));

        // Générer le token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .username(utilisateur.getUsername())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .userId(utilisateur.getId())
                .message("Connexion réussie")
                .build();
    }
}
