
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanService } from '../../services/kanban';
import { Board, Column, Task } from '../../models/kanban.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, RouterLink],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})



export class BoardComponent implements OnInit {
  // Données du tableau actuel
  board: Board | null = null;
  isAddingBoard = false;
  newBoardName = '';

  editingTaskId: number | null = null;
  tempTaskTitle: string = '';
  tempTaskDesc: string = '';

  allBoards: Board[] = [];


  isAddingColumn = false;
  newColumnName: string = '';

  editingColumnId: number | null = null;
  tempColumnName: string = '';

  newTaskTitre: string = '';
  newTaskDescription: string = '';
  selectedColumnId: number | undefined = undefined;

  isEditingBoardName = false;
  tempBoardName = '';

  constructor(
    private kanbanService: KanbanService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllBoards();
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadBoard(id);
      }
    });
  }

  saveNewBoard(): void {
    if (!this.newBoardName.trim()) {
      this.isAddingBoard = false;
      return;
    }

    this.kanbanService.createBoard({ nom: this.newBoardName }).subscribe({
      next: (savedBoard) => {
        this.newBoardName = '';
        this.isAddingBoard = false;
        this.loadAllBoards();
        this.goToBoard(savedBoard.id!);
      },
      error: (err) => console.error("Erreur création board", err)
    });
  }

  loadAllBoards(): void {
    this.kanbanService.getAllBoards(0, 10).subscribe({
      next: (response) => {
        this.allBoards = response.content;
      },
      error: (err) => console.error('Erreur chargement boards', err)
    });
  }

  goToBoard(id: number): void {
    this.router.navigate(['/board', id]);
  }

  addColumn(): void {
    if (!this.newColumnName.trim() || !this.board?.id) return;

    const newCol = { nom: this.newColumnName };
    this.kanbanService.createColumn(this.board.id, newCol).subscribe({
      next: () => {
        this.newColumnName = '';
        this.isAddingColumn = false;
        this.loadBoard(this.board!.id!);
      }
    });
  }

  addTask(columnId: number): void {
    if (!this.newTaskTitre.trim()) return;

    const newTask = {
      titre: this.newTaskTitre,
      description: this.newTaskDescription
    };

    this.kanbanService.createTask(columnId, newTask).subscribe({
      next: () => {
        this.newTaskTitre = '';
        this.newTaskDescription = '';
        this.selectedColumnId = undefined;
        this.loadBoard(this.board!.id!);
      }
    });
  }

  drop(event: CdkDragDrop<any>, newColumnId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];

      if (task && task.id) {
        this.kanbanService.moveTask(task.id, newColumnId).subscribe({
          next: () => {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
          },
          error: (err) => console.error("Erreur de déplacement", err)
        });
      }
    }
  }

  openAddBoardPrompt(): void {
    const name = prompt("Nom du nouveau tableau :");
    if (name) {
      this.kanbanService.createBoard({ nom: name }).subscribe({
        next: () => this.loadAllBoards(),
        error: (err) => console.error("Erreur création board", err)
      });
    }
  }

  startEditingTask(task: Task) {
    this.editingTaskId = task.id!;
    this.tempTaskTitle = task.titre;
    this.tempTaskDesc = task.description || '';
  }

  saveTaskUpdate(taskId: number): void {
    if (!this.tempTaskTitle.trim()) return;

    const updatedData = { titre: this.tempTaskTitle, description: this.tempTaskDesc };
    this.kanbanService.updateTask(taskId, updatedData).subscribe({
      next: () => {
        this.editingTaskId = null; // Quitte le mode édition
        this.loadBoard(this.board!.id!); // Rafraîchit les données
      }
    });
  }
  confirmDeleteTask(taskId: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      this.kanbanService.deleteTask(taskId).subscribe({
        next: () => this.loadBoard(this.board!.id!)
      });
    }
  }

  startEditingColumn(col: Column) {
    this.editingColumnId = col.id!;
    this.tempColumnName = col.nom;
  }

  saveColumnUpdate(columnId: number): void {
    if (!this.tempColumnName.trim()) return;

    this.kanbanService.updateColumn(columnId, { nom: this.tempColumnName }).subscribe({
      next: () => {
        this.editingColumnId = null;
        this.loadBoard(this.board!.id!);
      }
    });
  }

  confirmDeleteColumn(columnId: number): void {
    if (confirm("Attention : supprimer cette colonne supprimera également toutes les tâches qu'elle contient. Continuer ?")) {
      this.kanbanService.deleteColumn(columnId).subscribe({
        next: () => this.loadBoard(this.board!.id!)
      });
    }
  }

  startEditingBoardName() {
    this.isEditingBoardName = true;
    this.tempBoardName = this.board!.nom;
  }
  saveBoardName() {
    if (!this.tempBoardName.trim()) {
      this.isEditingBoardName = false;
      return;
    }

    this.kanbanService.updateBoard(this.board!.id!, { nom: this.tempBoardName }).subscribe({
      next: () => {
        this.isEditingBoardName = false;
        this.loadBoard(this.board!.id!);
        this.loadAllBoards();
      }
    });
  }

  confirmDeleteBoard() {
    if (confirm(`🚨 Attention : Vous allez supprimer le tableau "${this.board!.nom}" et TOUT son contenu. Continuer ?`)) {
      this.kanbanService.deleteBoard(this.board!.id!).subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        }
      });
    }
  }

  loadBoard(id: number): void {
    this.kanbanService.getBoard(id).subscribe({
      next: (data) => {
        this.board = data;
        this.board.colonnes?.forEach(col => {
          col.currentPage = col.currentPage ?? 0;
          if (!col.totalPages) {
            col.totalPages = (col.taches && col.taches.length >= 5) ? 2 : 1;
          }

          col.isLoading = false;
        });
      }
    });
  }

  loadMoreTasks(col: Column): void {
    if (!col.id || col.isLoading) return;

    col.isLoading = true;
    const nextPage = (col.currentPage || 0) + 1;

    this.kanbanService.getTasksByColumn(col.id, nextPage, 5).subscribe({
      next: (response) => {
        if (col.taches && response.content) {
          col.taches = [...col.taches, ...response.content];
        }
        col.currentPage = response.number;
        col.totalPages = response.totalPages;
        col.isLoading = false;
      },
      error: () => col.isLoading = false
    });
  }

  private palette = [
    '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6'
  ];

  getRandomColor(): string {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  isUserMenuOpen = false;

  get username(): string {
    return localStorage.getItem('currentUser') || 'Utilisateur';
  }

  get userInitials(): string {
    const name = this.username;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    this.authService.logout(); // Utilise la méthode que nous avons créée
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.isUserMenuOpen = false;
    }
  }

}
