package ma.xproce.kanban_table_swebsite.services;

import ma.xproce.kanban_table_swebsite.entities.Board;
import ma.xproce.kanban_table_swebsite.entities.Column;
import ma.xproce.kanban_table_swebsite.entities.Tag;
import ma.xproce.kanban_table_swebsite.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;


public interface IKanbanService {
    Page<Board> getAllBoards(String username, int page, int size);
    Board createBoard(Board board, String username);

    Board createBoard(Board board);
    Board getBoardById(Long id);
    Page<Board> getAllBoards(Pageable pageable);

    Column createColumnInBoard(Long BoardId, Column column);

    Board updateBoard(Long id, Board board);
    Column updateColumn(Long id, Column column);
    Task updateTask(Long id, Task task);

    void deleteBoard(Long id);
    void deleteColumn(Long id);
    void deleteTask(Long id);

    Task createTaskInColumn(Long ColumnId, Task task);
    Task moveTask(Long TaskId, Long newColumnId);
    Page<Task> getTasksByColumn(Long ColumnId, Pageable pageable);
    Page<Task> searchTasksByTitre(String keyword, Pageable pageable);

    Tag createTag(Tag tag);
    Task addTagToTask(Long taskId, Long tagId);
    Task removeTagFromTask(Long taskId, Long tagId);

}
