package ma.xproce.kanban_table_swebsite.services;

import ma.xproce.kanban_table_swebsite.entities.Board;
import ma.xproce.kanban_table_swebsite.entities.Column;
import ma.xproce.kanban_table_swebsite.entities.Tag;
import ma.xproce.kanban_table_swebsite.entities.Task;
import ma.xproce.kanban_table_swebsite.repositories.BoardRepository;
import ma.xproce.kanban_table_swebsite.repositories.ColumnRepository;
import ma.xproce.kanban_table_swebsite.repositories.TagRepository;
import ma.xproce.kanban_table_swebsite.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // Vérifie bien cet import

import java.util.List;

@Service
@Transactional

public class KanbanServiceImpl implements IKanbanService {
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private ColumnRepository columnRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TagRepository tagRepository;


    @Override
    public Page<Board> getAllBoards(String username, int page, int size) {
        return boardRepository.findByUsername(username, PageRequest.of(page, size));
    }

    @Override
    public Board createBoard(Board board, String username) {
        board.setUsername(username);
        return boardRepository.save(board);
    }

    @Override
    public Board createBoard(Board board) {
        return boardRepository.save(board);
    }

    @Override
    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Board non trouvé"));
    }
    @Override
    public Page<Board> getAllBoards(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    @Override
    public Column createColumnInBoard(Long boardId, Column column) {
        Board board = getBoardById(boardId);
        column.setBoard(board);
        return columnRepository.save(column);
    }

    @Override
    public Task createTaskInColumn(Long columnId, Task task) {
        Column column = columnRepository.findById(columnId).orElseThrow(() ->
                new RuntimeException("Colonne non trouvée"));
        task.setColumn(column);
        return taskRepository.save(task);
    }

    @Override
    public Task moveTask(Long taskId, Long newColumnId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() ->
                new RuntimeException("Tâche non trouvée"));
        Column newColumn = columnRepository.findById(newColumnId).orElseThrow(() ->
                new RuntimeException("Colonne non trouvée"));
        task.setColumn(newColumn);

        return taskRepository.save(task);
    }

    @Override
    public Page<Task> getTasksByColumn(Long columnId, Pageable pageable) {
        return taskRepository.findByColumnId(columnId, pageable);
    }

    @Override
    public Page<Task> searchTasksByTitre(String keyword, Pageable pageable) {
        return taskRepository.findByTitreContains(keyword, pageable);
    }

    @Override
    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    @Override
    public Task addTagToTask(Long taskId, Long tagId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() ->
                new RuntimeException("Tâche non trouvée"));
        Tag tag = tagRepository.findById(tagId).orElseThrow(() ->
                new RuntimeException("Tag non trouvé"));
        task.getTags().add(tag);
        return taskRepository.save(task);
    }

    @Override
    public Task removeTagFromTask(Long taskId, Long tagId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() ->
                new RuntimeException("Tâche non trouvée"));
        Tag tag = tagRepository.findById(tagId).orElseThrow(() ->
                new RuntimeException("Tag non trouvé"));

        task.getTags().remove(tag);

        return taskRepository.save(task);
    }

    @Override
    public Board updateBoard(Long id, Board boardDetails) {
        Board board = getBoardById(id);
        board.setNom(boardDetails.getNom());
        return boardRepository.save(board);
    }

    @Override
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    @Override
    public Column updateColumn(Long id, Column colDetails) {
        Column column = columnRepository.findById(id).orElseThrow(() -> new RuntimeException("Colonne non trouvée"));
        column.setNom(colDetails.getNom());
        return columnRepository.save(column);
    }

    @Override
    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
        task.setTitre(taskDetails.getTitre());
        task.setDescription(taskDetails.getDescription());
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
