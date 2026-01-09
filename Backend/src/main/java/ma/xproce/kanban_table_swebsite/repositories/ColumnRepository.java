package ma.xproce.kanban_table_swebsite.repositories;

import ma.xproce.kanban_table_swebsite.entities.Column;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColumnRepository extends JpaRepository<Column, Long> {

}