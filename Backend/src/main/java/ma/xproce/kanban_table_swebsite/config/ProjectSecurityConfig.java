package ma.xproce.kanban_table_swebsite.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // [cite: 50]
public class ProjectSecurityConfig {

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        // 1. Désactiver CSRF pour permettre les tests POST/PUT avec Postman sans token [cite: 73]
        http.csrf((csrf) -> csrf.disable())

                // 2. Configurer les règles d'autorisation [cite: 74]
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Autorise le navigateur à vérifier les droits
                        .requestMatchers("/api/boards/**", "/api/columns/**", "/api/tasks/**").authenticated()
                        .anyRequest().permitAll())// Refuser tout le reste par sécurité [cite: 55]

                // 3. Activer l'authentification par formulaire et Basic Auth (pour Postman) [cite: 76, 77]
                .formLogin(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults());

        return http.build(); // [cite: 78]
    }
}