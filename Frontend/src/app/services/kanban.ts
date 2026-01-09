import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, Column, Task, Tag } from '../models/kanban.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  // Ton port backend défini dans application.properties est 8088
  private apiUrl = 'http://localhost:8088/api';

  constructor(private http: HttpClient) { }

  // Récupérer le tableau complet
  getBoard(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/boards/${id}`);
  }

  // Créer une colonne
  createColumn(boardId: number, column: Column): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/boards/${boardId}/columns`, column);
  }

  // Créer une tâche
  createTask(columnId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/columns/${columnId}/tasks`, task);
  }

  // Déplacer une tâche (Point clé pour le Drag-and-Drop)
  moveTask(taskId: number, newColumnId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}/move/${newColumnId}`, {});
  }

  // Recherche avec pagination
  searchTasks(keyword: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/tasks/search`, { params });
  }

  createBoard(board: any): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, board);
  }


  updateTask(id: number, task: any): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task); //
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`); //
  }

  updateColumn(id: number, column: any): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/columns/${id}`, column);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/columns/${id}`);
  }

  updateBoard(id: number, board: any): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/boards/${id}`, board);
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/${id}`);
  }

  getAllBoards(page: number = 0, size: number = 6): Observable<PageResponse<Board>> {
    return this.http.get<PageResponse<Board>>(`${this.apiUrl}/boards?page=${page}&size=${size}`);
  }

  getTasksByColumn(columnId: number, page: number, size: number): Observable<PageResponse<Task>> {
    return this.http.get<PageResponse<Task>>(`${this.apiUrl}/columns/${columnId}/tasks-paginated?page=${page}&size=${size}`);
  }

}
