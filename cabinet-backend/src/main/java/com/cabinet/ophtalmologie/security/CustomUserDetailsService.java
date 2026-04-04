package com.cabinet.ophtalmologie.security;

import com.cabinet.ophtalmologie.model.Utilisateur;
import com.cabinet.ophtalmologie.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé : " + username));

        if (!utilisateur.getActif()) {
            throw new UsernameNotFoundException("Compte désactivé : " + username);
        }

        return new User(
                utilisateur.getUsername(),
                utilisateur.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name())
                )
        );
    }
}
