import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterModule], // ✅ Import NgIf
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn = computed(() => this.authService.isLoggedIn()); // ✅ Reactive computed signal

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // ✅ Automatically updates signal
    this.router.navigate(['/login']);
  }
}
