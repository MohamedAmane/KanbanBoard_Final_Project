import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Puisque nous sommes en mode "In-Memory", plus besoin de basculer entre login/register
  authData = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.authData).subscribe({
      next: () => {
        // Redirection vers l'espace de travail global au lieu du projet 1
        this.router.navigate(['/boards']);
      },
      error: (err: any) => {
        alert("Identifiants incorrects (essayez admin / 12345)");
      }
    });
  }
}
