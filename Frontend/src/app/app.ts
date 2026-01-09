import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Import INDISPENSABLE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // On remplace BoardComponent par RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'kanban-frontend';
}
