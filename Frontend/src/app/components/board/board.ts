// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { KanbanService } from '../../services/kanban';
// import { Board } from '../../models/kanban.model';
// import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { ActivatedRoute, Router } from '@angular/router'; // N'oublie pas ces imports !
//
// @Component({
//   selector: 'app-board',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DragDropModule],
//   templateUrl: './board.html',
//   styleUrls: ['./board.scss']
// })
// export class BoardComponent implements OnInit {
//   board: Board | null = null;
//   allBoards: Board[] = []; // Liste pour la Navbar
//   isAddingColumn = false; // Pour basculer entre le "+" et l'input dans la carte
//   newColumnName = '';
//
//   constructor(
//     private kanbanService: KanbanService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}
//
//   ngOnInit(): void {
//     this.loadAllBoards();
//     // On écoute les changements de paramètres dans l'URL
//     this.route.params.subscribe(params => {
//       const id = +params['id']; // Le '+' transforme la chaîne "1" en nombre 1
//       if (id) {
//         this.loadBoard(id); // Appel de la méthode avec l'ID récupéré
//       }
//     });
//   }
//
//   loadAllBoards() {
//     this.kanbanService.getAllBoards().subscribe(data => this.allBoards = data);
//   }
//
//   goToBoard(id: number) {
//     this.router.navigate(['/board', id]);
//   }
//   loadBoard(id: number): void {
//     this.kanbanService.getBoard(id).subscribe({
//       next: (data) => {
//         this.board = data;
//         console.log('Board chargé :', data);
//       },
//       error: (err) => {
//         console.error('Erreur :', err);
//         this.router.navigate(['/boards']); // Redirection si l'ID n'existe pas
//       }
//     });
//   }
//   // À l'intérieur de ta classe BoardComponent
//   newColumnName: string = '';
//   newTaskTitre: string = '';
//   newTaskDescription: string = '';
//   selectedColumnId: number | undefined = undefined; // Pour savoir dans quelle colonne on ajoute la tâche
//
// // Méthode pour ajouter une colonne
//   addColumn(): void {
//     if (!this.newColumnName.trim()) return;
//
//     const newCol = { nom: this.newColumnName };
//     // Ton backend attend l'ID du board (1 par défaut ici)
//     this.kanbanService.createColumn(this.board!.id!, newCol).subscribe({
//       next: () => {
//         this.newColumnName = '';
//         this.isAddingColumn = false;
//         this.loadBoard(this.board!.id!); // AJOUTE l'ID ici
//       }
//     });
//   }
//
//   openAddBoardPrompt() {
//     const name = prompt("Nom du nouveau tableau :");
//     if (name) {
//       this.kanbanService.createBoard({ nom: name }).subscribe(() => this.loadAllBoards());
//     }
//   }
//
// // Méthode pour ajouter une tâche
//   addTask(columnId: number): void {
//     this.loadBoard(this.board!.id!); // AJOUTE l'ID ici
//     if (!this.newTaskTitre.trim()) return;
//
//     const newTask = {
//       titre: this.newTaskTitre,
//       description: this.newTaskDescription
//     };
//
//     this.kanbanService.createTask(columnId, newTask).subscribe({
//       next: () => {
//         this.newTaskTitre = '';
//         this.newTaskDescription = '';
//         this.selectedColumnId = undefined;
//         if (this.board && this.board.id) {
//           this.loadBoard(this.board.id); // ✅ On repasse l'ID du board actuel
//         }
//       }
//     });
//   }
//   // On utilise 'any' pour le premier paramètre afin de rendre le type compatible avec le template
//   drop(event: CdkDragDrop<any>, newColumnId: number) {
//     if (event.previousContainer === event.container) {
//       // Déplacement dans la même colonne
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       // Déplacement vers une autre colonne
//       const task = event.previousContainer.data[event.previousIndex];
//
//       if (task && task.id) {
//         this.kanbanService.moveTask(task.id, newColumnId).subscribe({
//           next: () => {
//             transferArrayItem(
//               event.previousContainer.data,
//               event.container.data,
//               event.previousIndex,
//               event.currentIndex
//             );
//           },
//           error: (err) => console.error("Erreur de déplacement :", err)
//         });
//       }
//     }
//   }
//   // Variables à ajouter
//   newBoardName: string = '';
//   searchQuery: string = '';
//
//   createNewBoard(): void {
//     if (!this.newBoardName.trim()) return;
//     this.kanbanService.createBoard({ nom: this.newBoardName }).subscribe(newBoard => {
//       this.newBoardName = '';
//       // Ici, on pourrait charger le nouveau board
//       alert("Nouveau tableau créé ! ID: " + newBoard.id);
//     });
//   }
//
//   onSearch(): void {
//     if (this.searchQuery.length > 2) {
//       this.kanbanService.searchTasks(this.searchQuery, 0, 10).subscribe(page => {
//         console.log("Résultats de recherche :", page.content);
//         // Optionnel : Surligner ou filtrer visuellement
//       });
//     }
//   }
// }


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

  // Liste de tous les tableaux pour la barre de navigation
  allBoards: Board[] = [];

  // Variables pour la gestion des colonnes
  isAddingColumn = false;
  newColumnName: string = '';

  editingColumnId: number | null = null;
  tempColumnName: string = '';

  // Variables pour la gestion des tâches
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
    // 1. Charger la liste de tous les tableaux pour la Navbar
    this.loadAllBoards();

    // 2. Écouter les changements d'ID dans l'URL (ex: /board/1)
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
        this.loadAllBoards(); // Rafraîchir la liste des onglets
        this.goToBoard(savedBoard.id!); // Naviguer vers le nouveau board
      },
      error: (err) => console.error("Erreur création board", err)
    });
  }

  // Charge la liste complète des boards depuis le backend (port 8088)
  loadAllBoards(): void {
    // On spécifie que le service renvoie une PageResponse
    this.kanbanService.getAllBoards(0, 10).subscribe({
      // On récupère 'response' au lieu de 'data'
      next: (response) => {
        // On affecte uniquement la partie 'content' qui est le tableau Board[]
        this.allBoards = response.content;
      },
      error: (err) => console.error('Erreur chargement boards', err)
    });
  }

  // Navigation vers un autre tableau depuis la Navbar
  goToBoard(id: number): void {
    this.router.navigate(['/board', id]);
  }

  // Création d'une nouvelle colonne (Ghost Card)
  addColumn(): void {
    if (!this.newColumnName.trim() || !this.board?.id) return;

    const newCol = { nom: this.newColumnName };
    this.kanbanService.createColumn(this.board.id, newCol).subscribe({
      next: () => {
        this.newColumnName = '';
        this.isAddingColumn = false;
        this.loadBoard(this.board!.id!); // Rafraîchir avec le bon ID
      }
    });
  }

  // Création d'une tâche dans une colonne spécifique
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
        this.loadBoard(this.board!.id!); // Rafraîchir
      }
    });
  }

  // Logique de Drag-and-Drop avec persistance en base de données
  drop(event: CdkDragDrop<any>, newColumnId: number) {
    if (event.previousContainer === event.container) {
      // Déplacement interne
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Déplacement entre colonnes
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

  // Fonction rapide pour ajouter un board depuis la barre du haut
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
        this.loadAllBoards(); // Pour mettre à jour la liste dans la Navbar
      }
    });
  }

  confirmDeleteBoard() {
    if (confirm(`🚨 Attention : Vous allez supprimer le tableau "${this.board!.nom}" et TOUT son contenu. Continuer ?`)) {
      this.kanbanService.deleteBoard(this.board!.id!).subscribe({
        next: () => {
          this.router.navigate(['/boards']); // Redirection vers le dashboard
        }
      });
    }
  }

  // 1. Initialise les propriétés de pagination quand le board est chargé
  loadBoard(id: number): void {
    this.kanbanService.getBoard(id).subscribe({
      next: (data) => {
        this.board = data;
        this.board.colonnes?.forEach(col => {
          // Ne pas écraser si le backend envoie déjà la valeur
          col.currentPage = col.currentPage ?? 0;

          // Si le backend n'envoie pas totalPages, on met 2 pour forcer l'affichage du bouton
          // (à condition que la liste de tâches soit déjà "pleine", ex: 5 tâches)
          if (!col.totalPages) {
            col.totalPages = (col.taches && col.taches.length >= 5) ? 2 : 1;
          }

          col.isLoading = false;
        });
      }
    });
  }

// 2. La méthode appelée par le bouton "Charger plus"
  loadMoreTasks(col: Column): void {
    if (!col.id || col.isLoading) return;

    col.isLoading = true;
    const nextPage = (col.currentPage || 0) + 1;

    this.kanbanService.getTasksByColumn(col.id, nextPage, 5).subscribe({
      next: (response) => {
        // On ajoute les nouvelles tâches à la liste existante
        if (col.taches && response.content) {
          col.taches = [...col.taches, ...response.content];
        }
        // On met à jour les compteurs
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

  // Fonction pour obtenir une couleur aléatoire
  getRandomColor(): string {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  isUserMenuOpen = false;

// Récupération du nom d'utilisateur
  get username(): string {
    return localStorage.getItem('currentUser') || 'Utilisateur';
  }

// Calcul des initiales (ex: "Mohamed Amane" -> "MA", "admin" -> "A")
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
    // Si le clic n'est pas sur l'avatar ou le menu, on ferme
    if (!target.closest('.user-menu-container')) {
      this.isUserMenuOpen = false;
    }
  }

}
