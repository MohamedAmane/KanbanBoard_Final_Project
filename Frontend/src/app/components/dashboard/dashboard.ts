import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KanbanService } from '../../services/kanban';
import { Board } from '../../models/kanban.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  boards: Board[] = [];
  newBoardName: string = '';
  editingBoardId: number | null = null;
  tempBoardName: string = '';

  constructor(private kanbanService: KanbanService, private router: Router) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  goToBoard(id: number) {
    this.router.navigate(['/board', id]); // Navigation vers le détail
  }

  isAddingBoard = false;


  createBoard() {
    if (!this.newBoardName.trim()) {
      this.isAddingBoard = false;
      return;
    }

    this.kanbanService.createBoard({ nom: this.newBoardName }).subscribe({
      next: () => {
        this.newBoardName = '';
        this.isAddingBoard = false;
        this.loadBoards();
      },
      error: (err) => console.error("Erreur lors de la création du board", err)
    });
  }

  startEditing(board: Board) {
    this.editingBoardId = board.id!;
    this.tempBoardName = board.nom;
  }

  saveUpdate(id: number) {
    if (!this.tempBoardName.trim()) return;
    this.kanbanService.updateBoard(id, { nom: this.tempBoardName }).subscribe({
      next: () => {
        this.editingBoardId = null;
        this.loadBoards(); // Rafraîchir la liste
      }
    });
  }

  deleteBoard(id: number) {
    if (confirm("🚨 Voulez-vous vraiment supprimer ce tableau et tout son contenu ?")) {
      this.kanbanService.deleteBoard(id).subscribe({
        next: () => this.loadBoards()
      });
    }
  }

  currentPage = 0;
  pageSize = 6;
  totalPages = 0;

  loadBoards() {
    this.kanbanService.getAllBoards(this.currentPage, this.pageSize).subscribe(page => {
      this.boards = page.content;
      this.totalPages = page.totalPages;
    });
  }

  changePage(delta: number) {
    this.currentPage += delta;
    this.loadBoards();
  }


}
