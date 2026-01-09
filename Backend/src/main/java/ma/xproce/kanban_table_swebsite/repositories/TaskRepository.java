package ma.xproce.kanban_table_swebsite.repositories;

import ma.xproce.kanban_table_swebsite.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByColumnId(Long columnId, Pageable pageable);

    Page<Task> findByTitreContains(String keyword, Pageable pageable);
}