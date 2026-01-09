package ma.xproce.kanban_table_swebsite.repositories;

import ma.xproce.kanban_table_swebsite.entities.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;



@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByUsername(String username, Pageable pageable);

}