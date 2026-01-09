package ma.xproce.kanban_table_swebsite.repositories;

import ma.xproce.kanban_table_swebsite.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
