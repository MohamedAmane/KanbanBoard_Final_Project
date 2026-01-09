package ma.xproce.kanban_table_swebsite.repositories;

import ma.xproce.kanban_table_swebsite.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

}