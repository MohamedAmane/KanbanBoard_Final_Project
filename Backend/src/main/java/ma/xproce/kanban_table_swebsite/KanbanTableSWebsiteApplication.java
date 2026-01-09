package ma.xproce.kanban_table_swebsite;

import ma.xproce.kanban_table_swebsite.entities.Board;
import ma.xproce.kanban_table_swebsite.entities.Column;
import ma.xproce.kanban_table_swebsite.entities.Tag;
import ma.xproce.kanban_table_swebsite.entities.Task;
import ma.xproce.kanban_table_swebsite.repositories.BoardRepository;
import ma.xproce.kanban_table_swebsite.repositories.ColumnRepository;
import ma.xproce.kanban_table_swebsite.repositories.TagRepository;
import ma.xproce.kanban_table_swebsite.repositories.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class KanbanTableSWebsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(KanbanTableSWebsiteApplication.class, args);
    }

    @Bean // 1. Déclare ce bloc de code comme un composant géré par Spring
    CommandLineRunner start(BoardRepository boardRepo,
                            ColumnRepository colRepo,
                            TaskRepository taskRepo,
                            TagRepository tagRepo) {
        return args -> {



        };
    }
}