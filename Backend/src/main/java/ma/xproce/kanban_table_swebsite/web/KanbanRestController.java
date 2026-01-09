package ma.xproce.kanban_table_swebsite.web;

import jakarta.validation.Valid; // Pour l'annotation @Valid
import ma.xproce.kanban_table_swebsite.entities.*;
import ma.xproce.kanban_table_swebsite.repositories.UserRepository;
import ma.xproce.kanban_table_swebsite.services.IKanbanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult; // Pour la validation
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class KanbanRestController {

    @Autowired
    private IKanbanService kanbanService;

    @GetMapping("/boards/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {

        Board board = kanbanService.getBoardById(id);

        return ResponseEntity.ok(board);
    }


    @GetMapping("/boards")
    public Page<Board> getBoards(
            Authentication authentication, // Récupère l'utilisateur connecté
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        // authentication.getName() renverra "admin" ou "user"
        return kanbanService.getAllBoards(authentication.getName(), page, size);
    }

//    @PostMapping("/boards")
//    public ResponseEntity<Board> createBoard(@Valid @RequestBody Board board) {
//
//        Board savedBoard = kanbanService.createBoard(board);
//
//        return new ResponseEntity<>(savedBoard, HttpStatus.CREATED);
//    }

    @GetMapping("/columns/{columnId}/tasks-paginated")
    public Page<Task> getTasksByColumn(
            @PathVariable Long columnId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return kanbanService.getTasksByColumn(columnId, pageable);
    }

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<Column> createColumnInBoard(
            @PathVariable Long boardId,
            @Valid @RequestBody Column column) {

        Column savedColumn = kanbanService.createColumnInBoard(boardId, column);
        return new ResponseEntity<>(savedColumn, HttpStatus.CREATED);
    }

    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<?> createTaskInColumn(
            @PathVariable Long columnId,
            @Valid @RequestBody Task task,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
        }

        Task savedTask = kanbanService.createTaskInColumn(columnId, task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @PutMapping("/tasks/{taskId}/move/{newColumnId}")
    public ResponseEntity<Task> moveTask(
            @PathVariable Long taskId,
            @PathVariable Long newColumnId) {

        Task movedTask = kanbanService.moveTask(taskId, newColumnId);
        return ResponseEntity.ok(movedTask);
    }

    @GetMapping("/tasks/search")
    public Page<Task> searchTasks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return kanbanService.searchTasksByTitre(keyword, pageable);
    }


    @PostMapping("/tags")
    public ResponseEntity<Tag> createTag(@Valid @RequestBody Tag tag) {
        Tag savedTag = kanbanService.createTag(tag);
        return new ResponseEntity<>(savedTag, HttpStatus.CREATED);
    }

    @PostMapping("/tasks/{taskId}/tags/{tagId}")
    public ResponseEntity<Task> addTagToTask(
            @PathVariable Long taskId,
            @PathVariable Long tagId) {

        Task updatedTask = kanbanService.addTagToTask(taskId, tagId);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/tasks/{taskId}/tags/{tagId}")
    public ResponseEntity<Task> removeTagFromTask(
            @PathVariable Long taskId,
            @PathVariable Long tagId) {

        Task updatedTask = kanbanService.removeTagFromTask(taskId, tagId);
        return ResponseEntity.ok(updatedTask);
    }

    // --- UPDATES ---

    @PutMapping("/boards/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody Board board) {
        return kanbanService.updateBoard(id, board);
    }

    @PutMapping("/columns/{id}")
    public Column updateColumn(@PathVariable Long id, @RequestBody Column column) {
        return kanbanService.updateColumn(id, column);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return kanbanService.updateTask(id, task);
    }



    @DeleteMapping("/boards/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
        kanbanService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/columns/{id}")
    public ResponseEntity<?> deleteColumn(@PathVariable Long id) {
        kanbanService.deleteColumn(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        kanbanService.deleteTask(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/boards")
    public Board saveBoard(@RequestBody Board board, Authentication authentication) {
        return kanbanService.createBoard(board, authentication.getName());
    }

    // Ajoutez ces injections en haut de la classe
//    @Autowired
//    private UserRepository userRepository;

//    @Autowired
//    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

//    // Ajoutez cette méthode
//    @PostMapping("/auth/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        // 1. Vérifier si l'utilisateur existe déjà
//        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
//            return ResponseEntity.badRequest().body("Erreur : Le nom d'utilisateur est déjà pris.");
//        }
//
//        // 2. Encoder le mot de passe avant la sauvegarde
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        // 3. Assigner un rôle par défaut
//        if (user.getRole() == null) user.setRole("ROLE_USER");
//
//        // 4. Sauvegarder
//        User savedUser = userRepository.save(user);
//        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
//    }


}


//package ma.xproce.kanban_table_swebsite.web;
//
//import jakarta.validation.Valid;
//import ma.xproce.kanban_table_swebsite.entities.*;
//import ma.xproce.kanban_table_swebsite.repositories.UserRepository;
//import ma.xproce.kanban_table_swebsite.services.IKanbanService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication; // Import correct
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin("*")
//public class KanbanRestController {
//
//    @Autowired
//    private IKanbanService kanbanService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    // --- AUTHENTIFICATION / INSCRIPTION ---
//
//    @PostMapping("/auth/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
//            return ResponseEntity.badRequest().body("Erreur : Le nom d'utilisateur est déjà pris.");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        if (user.getRole() == null) user.setRole("ROLE_USER");
//        User savedUser = userRepository.save(user);
//        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
//    }
//
//    // --- BOARDS (Avec isolation par utilisateur) ---
//
//    @GetMapping("/boards")
//    public Page<Board> getBoards(
//            Authentication authentication,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "6") int size) {
//        // On utilise authentication.getName() pour filtrer les boards de l'utilisateur
//        return kanbanService.getAllBoards(authentication.getName(), page, size);
//    }
//
//    @PostMapping("/boards")
//    public ResponseEntity<Board> saveBoard(@Valid @RequestBody Board board, Authentication authentication) {
//        // On lie le board à l'utilisateur connecté
//        Board savedBoard = kanbanService.createBoard(board, authentication.getName());
//        return new ResponseEntity<>(savedBoard, HttpStatus.CREATED);
//    }
//
//    @GetMapping("/boards/{id}")
//    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
//        Board board = kanbanService.getBoardById(id);
//        return ResponseEntity.ok(board);
//    }
//
//    @PutMapping("/boards/{id}")
//    public Board updateBoard(@PathVariable Long id, @RequestBody Board board) {
//        return kanbanService.updateBoard(id, board);
//    }
//
//    @DeleteMapping("/boards/{id}")
//    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
//        kanbanService.deleteBoard(id);
//        return ResponseEntity.ok().build();
//    }
//
//    // --- COLUMNS ---
//
//    @PostMapping("/boards/{boardId}/columns")
//    public ResponseEntity<Column> createColumnInBoard(
//            @PathVariable Long boardId,
//            @Valid @RequestBody Column column) {
//        Column savedColumn = kanbanService.createColumnInBoard(boardId, column);
//        return new ResponseEntity<>(savedColumn, HttpStatus.CREATED);
//    }
//
//    @PutMapping("/columns/{id}")
//    public Column updateColumn(@PathVariable Long id, @RequestBody Column column) {
//        return kanbanService.updateColumn(id, column);
//    }
//
//    @DeleteMapping("/columns/{id}")
//    public ResponseEntity<?> deleteColumn(@PathVariable Long id) {
//        kanbanService.deleteColumn(id);
//        return ResponseEntity.ok().build();
//    }
//
//    // --- TASKS ---
//
//    @GetMapping("/columns/{columnId}/tasks-paginated")
//    public Page<Task> getTasksByColumn(
//            @PathVariable Long columnId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return kanbanService.getTasksByColumn(columnId, pageable);
//    }
//
//    @PostMapping("/columns/{columnId}/tasks")
//    public ResponseEntity<?> createTaskInColumn(
//            @PathVariable Long columnId,
//            @Valid @RequestBody Task task,
//            BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            return new ResponseEntity<>(bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
//        }
//        Task savedTask = kanbanService.createTaskInColumn(columnId, task);
//        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
//    }
//
//    @PutMapping("/tasks/{taskId}/move/{newColumnId}")
//    public ResponseEntity<Task> moveTask(
//            @PathVariable Long taskId,
//            @PathVariable Long newColumnId) {
//        Task movedTask = kanbanService.moveTask(taskId, newColumnId);
//        return ResponseEntity.ok(movedTask);
//    }
//
//    @PutMapping("/tasks/{id}")
//    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
//        return kanbanService.updateTask(id, task);
//    }
//
//    @DeleteMapping("/tasks/{id}")
//    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
//        kanbanService.deleteTask(id);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/tasks/search")
//    public Page<Task> searchTasks(
//            @RequestParam String keyword,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return kanbanService.searchTasksByTitre(keyword, pageable);
//    }
//
//    // --- TAGS ---
//
//    @PostMapping("/tags")
//    public ResponseEntity<Tag> createTag(@Valid @RequestBody Tag tag) {
//        Tag savedTag = kanbanService.createTag(tag);
//        return new ResponseEntity<>(savedTag, HttpStatus.CREATED);
//    }
//
//    @PostMapping("/tasks/{taskId}/tags/{tagId}")
//    public ResponseEntity<Task> addTagToTask(@PathVariable Long taskId, @PathVariable Long tagId) {
//        Task updatedTask = kanbanService.addTagToTask(taskId, tagId);
//        return ResponseEntity.ok(updatedTask);
//    }
//
//    @DeleteMapping("/tasks/{taskId}/tags/{tagId}")
//    public ResponseEntity<Task> removeTagFromTask(@PathVariable Long taskId, @PathVariable Long tagId) {
//        Task updatedTask = kanbanService.removeTagFromTask(taskId, tagId);
//        return ResponseEntity.ok(updatedTask);
//    }
//}