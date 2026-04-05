package com.cabinet.ophtalmologie.config;

import com.cabinet.ophtalmologie.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Endpoints publics
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Après
                        .requestMatchers("/files/uploads/**").permitAll()

                        // Endpoints Médecin
                        .requestMatchers("/api/analyses/en-attente").hasRole("MEDECIN")
                        .requestMatchers(HttpMethod.PUT, "/api/analyses/*/commentaire").hasRole("MEDECIN")
                        .requestMatchers(HttpMethod.PUT, "/api/analyses/*/urgent").hasRole("MEDECIN")
                        .requestMatchers("/api/rdv/urgent").hasRole("MEDECIN")

                        // Endpoints Secrétaire
                        .requestMatchers(HttpMethod.POST, "/api/patients").hasAnyRole("SECRETAIRE")
                        .requestMatchers("/api/rdv/demandes").hasAnyRole("SECRETAIRE", "MEDECIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rdv/*/approuver").hasRole("SECRETAIRE")
                        .requestMatchers(HttpMethod.PUT, "/api/rdv/*/refuser").hasRole("SECRETAIRE")

                        // Endpoints Patient
                        .requestMatchers("/api/analyses/upload").hasRole("PATIENT")
                        .requestMatchers("/api/patients/user/**").hasAnyRole("PATIENT", "MEDECIN", "SECRETAIRE")

                        // Endpoints partagés
                        .requestMatchers("/api/patients/**").hasAnyRole("MEDECIN", "SECRETAIRE", "PATIENT")
                        .requestMatchers("/api/dashboard/**").hasAnyRole("MEDECIN", "SECRETAIRE")

                        // Tout le reste nécessite une authentification
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}